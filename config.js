// Configuration File with Development Values
// These are dummy/development values - replace with real values for production

const CONFIG = {
    // Web3Forms API Key (get from https://web3forms.com/)
    WEB3FORMS_KEY: 'development_key',
    
    // Admin Panel Password (choose a strong password)
    ADMIN_PASSWORD: 'dev_password',
    
    // Encryption salt (generate a random string)
    SALT: 'dev_salt',
    
    // Additional security settings
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
    PASSWORD_MIN_LENGTH: 8
};

// Simple encryption/decryption functions
const CryptoUtils = {
    // Simple XOR encryption (for basic obfuscation)
    encrypt: function(text, salt) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
        }
        return btoa(result); // Base64 encode
    },
    
    decrypt: function(encryptedText, salt) {
        try {
            const decoded = atob(encryptedText); // Base64 decode
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
    
    // Hash function for passwords
    hash: function(text, salt) {
        let hash = 0;
        const combined = text + salt;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
};

// Export configuration with encryption
window.PortfolioConfig = {
    getWeb3FormsKey: function() {
        return CONFIG.WEB3FORMS_KEY;
    },
    
    getAdminPassword: function() {
        return CONFIG.ADMIN_PASSWORD;
    },
    
    getSalt: function() {
        return CONFIG.SALT;
    },
    
    getMaxLoginAttempts: function() {
        return CONFIG.MAX_LOGIN_ATTEMPTS;
    },
    
    getSessionTimeout: function() {
        return CONFIG.SESSION_TIMEOUT;
    },
    
    getPasswordMinLength: function() {
        return CONFIG.PASSWORD_MIN_LENGTH;
    },
    
    // Encrypt sensitive data
    encrypt: function(text) {
        return CryptoUtils.encrypt(text, CONFIG.SALT);
    },
    
    // Decrypt sensitive data
    decrypt: function(encryptedText) {
        return CryptoUtils.decrypt(encryptedText, CONFIG.SALT);
    },
    
    // Hash password for comparison
    hashPassword: function(password) {
        return CryptoUtils.hash(password, CONFIG.SALT);
    }
};

// Development mode warning
console.log('🔧 Development Mode: Using dummy configuration values'); 