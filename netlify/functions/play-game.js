const { getDatabase } = require('./utils/db');

exports.handler = async(event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { gameType, betAmount, characterId } = JSON.parse(event.body);
        const db = await getDatabase();

        // Verify character has enough money
        const [character] = await db.query(
            'SELECT cash FROM banking2_accounts WHERE id = ?', [characterId]
        );

        if (!character || character.money < betAmount) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Insufficient funds'
                })
            };
        }

        let won = false;
        let winAmount = 0;
        let message = '';

        // Game logic
        if (gameType === 'coinflip') {
            won = Math.random() >= 0.5;
            winAmount = won ? betAmount * 2 : 0;
            message = won ? 'Heads - You won!' : 'Tails - You lost!';
        } else if (gameType === 'dice') {
            const roll = Math.floor(Math.random() * 12) + 1;
            won = roll >= 7;
            winAmount = won ? Math.floor(betAmount * 1.8) : 0;
            message = `Rolled ${roll} - ${won ? 'You won!' : 'You lost!'}`;
        }

        // Update character's money
        const newAmount = won ? character.money + (winAmount - betAmount) : character.money - betAmount;
        await db.query(
            'UPDATE banking2_accounts SET cash = ? WHERE id = ?', [newAmount, characterId]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                won,
                winAmount,
                message
            })
        };
    } catch (error) {
        console.error('Game error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Internal server error'
            })
        };
    }
};