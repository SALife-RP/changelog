// Configuration for Discord OAuth
(function() {

    // Only update config if it hasn't been set
    if (!window.appConfig) {
        window.appConfig = {
            DISCORD_CLIENT_ID: '612428144133013575',
            DISCORD_REDIRECT_URI: `${window.location.origin}/auth/discord/callback`,
            AUTH_ENDPOINT: 'https://discord.com/api/oauth2/authorize',
            TOKEN_ENDPOINT: '/.netlify/functions/auth-discord',
            OAUTH_SCOPES: 'identify email'
        };
    }
})();