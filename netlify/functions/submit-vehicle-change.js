const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const data = JSON.parse(event.body);

        // Send to Discord webhook
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        const message = {
            content: "New Vehicle Change Request",
            embeds: [{
                title: `Change Request for ${data.vehicle.name}`,
                color: 6837721, // #6741d9 in decimal
                fields: [{
                    name: "Vehicle Details",
                    value: `Model: ${data.vehicle.model}\nManufacturer: ${data.vehicle.manufacturer}\nClass: ${data.vehicle.class}\nCurrent Price: $${data.vehicle.price.toLocaleString()}`
                },
                {
                    name: "Reason for Change",
                    value: data.reason
                },
                {
                    name: "Suggested Change",
                    value: data.suggestion
                }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error('Discord webhook request failed');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to submit request' })
        };
    }
};