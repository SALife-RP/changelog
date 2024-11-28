const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    try {
        const serverAddress = 'https://velocityserver-zjepzy.users.cfx.re/ox_inventory';
        if (!serverAddress) {
            console.error('FIVEM_SERVER_ADDRESS not configured');
            throw new Error('Server address not configured');
        }   

        const itemsUrl = `${serverAddress}/items`;
        console.log('Attempting to fetch items from:', itemsUrl);

        const response = await fetch(itemsUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from FiveM server:', errorText);
            throw new Error(`FiveM server responded with status: ${response.status}`);
        }

        const items = await response.json();
        console.log('Successfully fetched items. Count:', Object.keys(items).length);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error('Detailed error in get-items function:', {
            error: error.message,
            stack: error.stack,
            serverAddress: process.env.FIVEM_SERVER_ADDRESS
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch inventory items',
                details: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

