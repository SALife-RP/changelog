const db = require("./utils/db");

exports.handler = async(event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    let connection;
    try {
        const { gameType, betAmount, characterId } = JSON.parse(event.body);

        // Log incoming request data
        console.log("Game request:", { gameType, betAmount, characterId });

        // Get database connection
        connection = await db.getDatabase();
        if (!connection) {
            throw new Error("Failed to connect to database");
        }

        // Verify character has enough money - add logging
        console.log("Querying banking account for ID:", characterId);
        const [rows] = await connection.query(
            "SELECT * FROM banking2_accounts WHERE user_id = ?", [characterId]
        );
        console.log("Query result:", rows);

        const character = rows[0];

        // Check if character exists and has enough cash
        if (!character) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Character not found",
                }),
            };
        }

        if (character.cash < betAmount) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Insufficient funds",
                    current: character.cash,
                    required: betAmount,
                }),
            };
        }

        let won = false;
        let winAmount = 0;
        let message = "";

        // Game logic
        if (gameType === "coinflip") {
            won = Math.random() >= 0.5;
            winAmount = won ? betAmount * 2 : 0;
            message = won ? "Heads - You won!" : "Tails - You lost!";
        } else if (gameType === "dice") {
            const roll = Math.floor(Math.random() * 6) + 1; // Roll 1-6
            won = roll >= 5; // Win only on 5 or 6 (33.33% chance)
            winAmount = won ? Math.floor(betAmount * 1.5) : 0; // Lower payout (1.5x)
            message = `Rolled ${roll}`;
        }

        // Update character's money - use cash instead of money
        const newAmount = won ?
            character.cash + (winAmount - betAmount) :
            character.cash - betAmount;

        console.log("Updating balance:", {
            oldAmount: character.cash,
            newAmount,
            won,
            winAmount,
            betAmount,
        });

        // Update the balance
        await connection.query(
            "UPDATE banking2_accounts SET cash = ? WHERE user_id = ?", [newAmount, characterId]
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                won,
                winAmount,
                message,
                oldBalance: character.cash,
                newBalance: newAmount,
            }),
        };
    } catch (error) {
        console.error("Game error:", {
            error: error.message,
            stack: error.stack,
            event: event.body,
        });

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Internal server error",
                error: error.message,
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
            }),
        };
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error("Error closing database connection:", err);
            }
        }
    }
};