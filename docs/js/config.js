// Configuration for Discord OAuth
(function() {
    // const redirectUri = `${window.location.origin}/auth/discord/callback`;
    const redirectUri = 'https://playsalife.com/auth/discord/callback';
    console.log('Configured redirect URI:', redirectUri); // Debug log

    // Only update config if it hasn't been set
    if (!window.appConfig) {
        window.appConfig = {
            DISCORD_CLIENT_ID: '612428144133013575',
            DISCORD_REDIRECT_URI: redirectUri,
            AUTH_ENDPOINT: 'https://discord.com/api/oauth2/authorize',
            TOKEN_ENDPOINT: '/.netlify/functions/auth-discord',
            OAUTH_SCOPES: 'identify'
        };
    }
})();