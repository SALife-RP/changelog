exports.handler = async (event, context) => {
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

        // Forward the request to get-user-data function
        const response = await fetch('/.netlify/functions/get-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ discord_id })
        });

        const data = await response.json();

        return {
            statusCode: response.status,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};