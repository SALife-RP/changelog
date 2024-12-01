const {
    checkRateLimit,
    validateAuth,
    getPlayerBalance,
    updatePlayerBalance,
    logGameAction
} = require('./db-utils');

exports.handler = async(event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Validate authentication
        const token = event.headers.authorization ? .replace('Bearer ', '');
        const user = await validateAuth(token);

        if (!user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized' })
            };
        }

        // Check rate limiting
        const canPlay = await checkRateLimit(user.id, 'games', 10, 60);
        if (!canPlay) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: 'Too many requests. Please wait before playing again.' })
            };
        }

        const { game, bet } = JSON.parse(event.body);
        const currentBalance = await getPlayerBalance(user.id);

        if (bet > currentBalance) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Insufficient funds' })
            };
        }

        // Process game
        let result;
        switch (game) {
            case 'coinflip':
                result = playCoinflip(bet);
                break;
            case 'dice':
                result = playDice(bet);
                break;
            case 'slots':
                result = playSlots(bet);
                break;
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid game' })
                };
        }

        // Calculate new balance
        const balanceChange = result.won ? result.amount : -bet;
        const newBalance = currentBalance + balanceChange;

        // Update balance and log game
        await updatePlayerBalance(user.id, newBalance);
        await logGameAction(user.id, game, bet, result, balanceChange);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                ...result,
                newBalance
            })
        };
    } catch (error) {
        console.error('Game error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

function playCoinflip(bet) {
    const won = Math.random() >= 0.5;
    return {
        won,
        amount: bet,
        details: `Coin landed on ${won ? 'heads' : 'tails'}`
    };
}

// Add similar functions for dice and slots...