// Configuration Loader for Portfolio Admin Panel
// This script fetches config from Netlify function or falls back to local values

(function() {
    // Fallback/development config
    const LOCAL_CONFIG = {
        WEB3FORMS_KEY: 'development_key',
        ADMIN_PASSWORD: 'dev_password',
        SALT: 'dev_salt',
        MAX_LOGIN_ATTEMPTS: 5,
        SESSION_TIMEOUT: 3600000,
        PASSWORD_MIN_LENGTH: 8
    };

    // Simple encryption/decryption functions
    const CryptoUtils = {
        encrypt: function(text, salt) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
            }
            return btoa(result);
        },
        decrypt: function(encryptedText, salt) {
            try {
                const decoded = atob(encryptedText);
                let result = '';
                for (let i = 0; i < decoded.length; i++) {
                    result += String.fromCharCode(decoded.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
                }
                return result;
            } catch (error) {
                console.error('Decryption failed:', error);
                return null;
            }
        },
        hash: function(text, salt) {
            let hash = 0;
            const combined = text + salt;
            for (let i = 0; i < combined.length; i++) {
                const char = combined.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(36);
        }
    };

    // Helper to set PortfolioConfig
    function setPortfolioConfig(config) {
        window.PortfolioConfig = {
            getWeb3FormsKey: function() { return config.WEB3FORMS_KEY; },
            getAdminPassword: function() { return config.ADMIN_PASSWORD; },
            getSalt: function() { return config.SALT; },
            getMaxLoginAttempts: function() { return config.MAX_LOGIN_ATTEMPTS; },
            getSessionTimeout: function() { return config.SESSION_TIMEOUT; },
            getPasswordMinLength: function() { return config.PASSWORD_MIN_LENGTH; },
            encrypt: function(text) { return CryptoUtils.encrypt(text, config.SALT); },
            decrypt: function(encryptedText) { return CryptoUtils.decrypt(encryptedText, config.SALT); },
            hashPassword: function(password) { return CryptoUtils.hash(password, config.SALT); }
        };
        window.PortfolioConfigReady = true;
        document.dispatchEvent(new Event('PortfolioConfigReady'));
    }

    // Try to fetch config from Netlify function
    fetch('/.netlify/functions/config')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(setPortfolioConfig)
        .catch(err => {
            console.warn('Falling back to local config:', err);
            setPortfolioConfig(LOCAL_CONFIG);
        });
})(); 
