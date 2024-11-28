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
        // Replace with your FiveM server address
        const response = await fetch('http://168.75.184.7:30120/items');
        const items = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error('Error fetching items:', error);
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

