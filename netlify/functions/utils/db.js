const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getUserByDiscordId(discordId) {
    try {
        // First get the account_id from user_ids
        const [userIds] = await pool.execute(
            'SELECT account_id FROM salrp_user_ids WHERE identifier = ?', [`discord:${discordId}`]
        );

        if (!userIds.length) return null;

        const accountId = userIds[0].account_id;

        // Get account information
        const [accounts] = await pool.execute(
            'SELECT * FROM salrp_user_accounts WHERE id = ?', [accountId]
        );

        if (!accounts.length) return null;

        const account = accounts[0];
        const characters = JSON.parse(account.characters);

        // Get all character information
        const characterData = await Promise.all(characters.map(async(charId) => {
            const [
                [identity],
                [money],
                [vehicles]
            ] = await Promise.all([
                pool.execute(
                    'SELECT * FROM salrp_user_identities WHERE user_id = ?', [charId]
                ),
                pool.execute(
                    'SELECT * FROM salrp_user_moneys WHERE user_id = ?', [charId]
                ),
                pool.execute(
                    'SELECT * FROM salrp_user_vehicles WHERE user_id = ?', [charId]
                )
            ]);

            return {
                identity: identity || null,
                money: money || { wallet: 0, bank: 0, debt: 0 },
                vehicles: vehicles || []
            };
        }));

        return {
            account: {
                id: account.id,
                adminLevel: account.adminlevel,
                salplus: account.salplus,
                aliases: JSON.parse(account.aliases),
                lastLogin: account.last_logged_in,
                banned: account.banned === 1
            },
            characters: characterData
        };
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

module.exports = {
    pool,
    getUserByDiscordId
};