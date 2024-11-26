const fetch = require('node-fetch');
const { getUserByDiscordId } = require('./utils/db');

exports.handler = async(event, context) => {
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

        const redirectUri = process.env.DISCORD_REDIRECT_URI || 'https://playsalife.com/auth/discord/callback';

        console.log('Auth function debug:', {
            clientId: process.env.DISCORD_CLIENT_ID,
            redirectUri: redirectUri,
            code: code.substring(0, 10) + '...'
        });

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
                redirect_uri: redirectUri,
                scope: 'identify'
            })
        });

        const tokenResponseText = await tokenResponse.text();

        if (!tokenResponse.ok) {
            console.error('Discord token exchange error:', {
                status: tokenResponse.status,
                response: tokenResponseText,
                redirectUri: redirectUri
            });

            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Failed to exchange authorization code',
                    details: tokenResponseText
                })
            };
        }

        const tokenData = JSON.parse(tokenResponseText);

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
                body: JSON.stringify({
                    error: 'Failed to fetch user information',
                    details: error
                })
            };
        }

        const userData = await userResponse.json();
        console.log('Discord user data retrieved:', userData);

        const gameData = await getUserByDiscordId(userData.id);
        console.log('Game data retrieved:', gameData);

        const token = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                user_id: userData.id,
                username: userData.username,
                discriminator: userData.discriminator,
                avatar: userData.avatar,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                game_data: gameData
            }
        };

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
                    tag: `${userData.username}#${userData.discriminator}`,
                    game_data: gameData
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