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
            // Execute all queries in parallel
            const [
                identityResults,
                moneyResults,
                vehicleResults
            ] = await Promise.all([
                pool.execute(
                    'SELECT * FROM salrp_user_identities WHERE user_id = ?', 
                    [charId]
                ),
                pool.execute(
                    'SELECT cash, debt FROM banking2_accounts WHERE user_id = ?', 
                    [charId]
                ),
                pool.execute(
                    'SELECT v.*, vm.name as model_name, vm.manufacturer, vm.class ' +
                    'FROM salrp_user_vehicles v ' +
                    'LEFT JOIN salrp_vehicle_models vm ON v.model = vm.model ' +
                    'WHERE v.user_id = ?',
                    [charId]
                )
            ]);

            // Extract the first row from each result
            const [identity] = identityResults[0];
            const [money] = moneyResults[0];
            const vehicles = vehicleResults[0];

            console.log('DB Query Results:', {
                charId,
                identity: identity || null,
                money: money || { cash: 0, debt: 0 },
                vehicles: vehicles || []
            });

            return {
                identity: identity ? [identity] : [],
                money: money ? [money] : [{ cash: 0, debt: 0 }],
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