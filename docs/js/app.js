function handleAuth() {
    try {
        if (!window.appConfig) {
            console.error('App configuration is not loaded');
            alert('Error: Unable to load configuration. Please try again later.');
            return;
        }

        if (!window.appConfig.DISCORD_CLIENT_ID) {
            console.error('Discord Client ID is not configured');
            alert('Error: Discord configuration is missing. Please try again later.');
            return;
        }

        const params = new URLSearchParams({
            client_id: window.appConfig.DISCORD_CLIENT_ID,
            redirect_uri: window.appConfig.DISCORD_REDIRECT_URI,
            response_type: 'code',
            scope: window.appConfig.OAUTH_SCOPES,
            prompt: 'consent'
        });

        const authUrl = `${window.appConfig.AUTH_ENDPOINT}?${params.toString()}`;
        console.log('Auth URL:', authUrl); // Debug log
        window.location.href = authUrl;
    } catch (error) {
        console.error('Auth error:', error);
        alert('An error occurred during authentication. Please try again later.');
    }
}