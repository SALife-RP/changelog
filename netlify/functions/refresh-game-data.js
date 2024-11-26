const { getUserByDiscordId } = require('./utils/db');

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { discord_id } = JSON.parse(event.body);

        if (!discord_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Discord ID is required' })
            };
        }

        const gameData = await getUserByDiscordId(discord_id);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        };
    } catch (error) {
        console.error('Refresh game data error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to refresh game data',
                details: error.message
            })
        };
    }
};