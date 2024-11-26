// Configuration for Discord OAuth
const config = {
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_REDIRECT_URI: `${window.location.origin}/auth/discord/callback`,
    AUTH_ENDPOINT: 'https://discord.com/api/oauth2/authorize',
    TOKEN_ENDPOINT: '/.netlify/functions/auth-discord'
};

window.appConfig = config;