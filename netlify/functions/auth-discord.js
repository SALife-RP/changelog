const fetch = require('node-fetch');

exports.handler = async(event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { code } = JSON.parse(event.body);

        if (!code) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No authorization code provided' })
            };
        }

        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
                scope: 'identify'
            })
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('Discord token exchange error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to exchange authorization code' })
            };
        }

        const tokenData = await tokenResponse.json();

        // Use the access token to get the user's information
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        if (!userResponse.ok) {
            const error = await userResponse.text();
            console.error('Discord user info error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch user information' })
            };
        }

        const userData = await userResponse.json();

        // Create a JWT token for the user
        const token = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
            data: {
                user_id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: userData.avatar,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token
            }
        };

        // Return the user data and token
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                user: {
                    id: userData.id,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    tag: `${userData.username}#${userData.discriminator}`
                }
            })
        };

    } catch (error) {
        console.error('Auth function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};