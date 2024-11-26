const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { lineId, lineContent, comment, page, userInfo } = JSON.parse(event.body);

        const webhookUrl = process.env.DISCORD_CHANGELOG_WEBHOOK_URL;
        if (!webhookUrl) {
            throw new Error('Discord webhook URL not configured');
        }

        const message = {
            embeds: [{
                title: `Comment on ${page === 'features' ? 'Feature' : 'Changelog'}`,
                description: 'A new comment has been added',
                color: page === 'features' ? 0x00ff00 : 0x0099ff,
                fields: [{
                    name: 'Submitted By',
                    value: `Discord: ${userInfo.discord || 'Not provided'}\nIn-Game Name: ${userInfo.ingame || 'Not provided'}`,
                    inline: false
                },
                {
                    name: 'Line Content',
                    value: lineContent.substring(0, 1024),
                    inline: false
                },
                {
                    name: 'Comment',
                    value: comment.substring(0, 1024),
                    inline: false
                },
                {
                    name: 'Line ID',
                    value: lineId,
                    inline: true
                }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error(`Discord API responded with ${response.status}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error sending comment:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Failed to send comment to Discord'
            })
        };
    }
};