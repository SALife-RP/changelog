const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        // You'll need to replace this with your actual FiveM server endpoint
        const response = await axios.get('https://servers-frontend.fivem.net/api/servers/single/zjepzy');
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                inventory_items: response.data.vars.inventory_items || {}
            })
        };
    } catch (error) {
        console.error('Error fetching server vars:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch server variables' })
        };
    }
}; 