// Netlify serverless function to serve configuration securely
exports.handler = async function(event, context) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get environment variables
    const config = {
        WEB3FORMS_KEY: process.env.WEB3FORMS_KEY,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        SALT: process.env.SALT,
        MAX_LOGIN_ATTEMPTS: 5,
        SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
        PASSWORD_MIN_LENGTH: 8
    };

    // Return configuration as JSON
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow CORS
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(config)
    };
}; 