const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        // Get the FiveM server address from environment variables
        const serverAddress = process.env.FIVEM_SERVER_ADDRESS;
        if (!serverAddress) {
            throw new Error('FIVEM_SERVER_ADDRESS not configured');
        }

        console.log('Fetching items from:', `${serverAddress}/items`);
        
        const response = await fetch(`${serverAddress}/items`);
        if (!response.ok) {
            throw new Error(`FiveM server responded with status: ${response.status}`);
        }

        const items = await response.json();
        console.log('Items fetched successfully:', Object.keys(items).length);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error('Error in get-items function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch inventory items',
                details: error.message 
            })
        };
    }
};

