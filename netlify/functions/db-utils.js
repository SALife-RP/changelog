const mysql = require('mysql2/promise');
const { Redis } = require('@upstash/redis');

// Initialize Redis for rate limiting
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN
});

// Create MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Rate limiting function
async function checkRateLimit(userId, action, limit = 10, window = 60) {
    const key = `ratelimit:${action}:${userId}`;
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, window);
    }

    return count <= limit;
}

// Authentication check
async function validateAuth(token, requiredPermissions = []) {
    if (!token) return false;

    try {
        const key = `auth:${token}`;
        const userData = await redis.get(key);

        if (!userData) return false;

        const user = JSON.parse(userData);

        // Check permissions if required
        if (requiredPermissions.length > 0) {
            const hasPermissions = requiredPermissions.every(perm =>
                user.permissions && user.permissions.includes(perm)
            );
            if (!hasPermissions) return false;
        }

        return user;
    } catch (error) {
        console.error('Auth validation error:', error);
        return false;
    }
}

// Database utility functions
async function getPlayerBalance(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT cash FROM banking2_accounts WHERE user_id = ? LIMIT 1', [userId]
        );
        return rows[0] ? .cash || 0;
    } catch (error) {
        console.error('Error getting player balance:', error);
        throw new Error('Failed to get player balance');
    }
}

async function updatePlayerBalance(userId, newBalance) {
    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        try {
            // Log the transaction
            await conn.execute(
                'INSERT INTO balance_history (user_id, old_balance, new_balance, action) VALUES (?, ?, ?, ?)', [userId, await getPlayerBalance(userId), newBalance, 'game']
            );

            // Update the balance
            await conn.execute(
                'UPDATE banking2_accounts SET cash = ? WHERE user_id = ?', [newBalance, userId]
            );

            await conn.commit();
            conn.release();
        } catch (error) {
            await conn.rollback();
            conn.release();
            throw error;
        }
    } catch (error) {
        console.error('Error updating player balance:', error);
        throw new Error('Failed to update player balance');
    }
}

// Game history tracking
async function logGameAction(userId, game, bet, result, balanceChange) {
    try {
        await pool.execute(
            'INSERT INTO game_history (user_id, game, bet_amount, result, balance_change) VALUES (?, ?, ?, ?, ?)', [userId, game, bet, JSON.stringify(result), balanceChange]
        );
    } catch (error) {
        console.error('Error logging game action:', error);
        // Don't throw - we don't want to break the game flow for logging errors
    }
}

module.exports = {
    checkRateLimit,
    validateAuth,
    getPlayerBalance,
    updatePlayerBalance,
    logGameAction,
    pool,
    redis
};