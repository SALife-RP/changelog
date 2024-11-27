const { getUserByDiscordId } = require('./get-user-data');

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get the Authorization header
        const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Missing or invalid authorization header' })
            };
        }

        // Extract the token
        const token = authHeader.split(' ')[1];
        
        // Get the discord_id from the request body
        const { discord_id } = JSON.parse(event.body);

        if (!discord_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Discord ID is required' })
            };
        }

        console.log('Refreshing game data for Discord ID:', discord_id);

        const userData = await getUserByDiscordId(discord_id);

        if (!userData) {
            console.log('No user data found for Discord ID:', discord_id);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' })
            };
        }

        console.log('Successfully refreshed game data');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify(userData)
        };
    } catch (error) {
        console.error('Refresh game data error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify({
                error: 'Failed to refresh game data',
                details: error.message
            })
        };
    }
};