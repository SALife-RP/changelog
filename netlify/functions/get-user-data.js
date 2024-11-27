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
        console.log('Getting user data for Discord ID:', discordId);
        
        const [userIds] = await pool.execute(
            'SELECT account_id FROM salrp_user_ids WHERE identifier = ?', 
            [`discord:${discordId}`]
        );

        if (!userIds.length) {
            console.log('No user found for Discord ID:', discordId);
            return null;
        }

        const accountId = userIds[0].account_id;
        console.log('Found account ID:', accountId);

        const [accounts] = await pool.execute(
            'SELECT * FROM salrp_user_accounts WHERE id = ?', 
            [accountId]
        );

        if (!accounts.length) {
            console.log('No account found for account ID:', accountId);
            return null;
        }

        const account = accounts[0];
        const characters = JSON.parse(account.characters);
        console.log('Found characters:', characters);

        const characterData = await Promise.all(characters.map(async(charId) => {
            const userId = parseInt(charId, 10);
            
            if (isNaN(userId)) {
                console.error('Invalid character ID:', charId);
                return null;
            }

            console.log('Fetching data for character ID:', userId);

            const [
                identityResults,
                moneyResults,
                vehicleResults
            ] = await Promise.all([
                pool.execute(
                    'SELECT * FROM salrp_user_identities WHERE user_id = ?', 
                    [userId]
                ),
                pool.execute(
                    'SELECT cash, debt FROM banking2_accounts WHERE user_id = ?', 
                    [userId]
                ),
                pool.execute(
                    'SELECT v.*, vm.name as model_name, vm.manufacturer, vm.class ' +
                    'FROM salrp_user_vehicles v ' +
                    'LEFT JOIN salrp_user_vehicles_data vm ON v.vehicle = vm.vehicle ' +
                    'WHERE v.user_id = ?',
                    [userId]
                )
            ]);

            const [identity] = identityResults[0];
            const [money] = moneyResults[0];
            const vehicles = vehicleResults[0];

            console.log('Character data retrieved:', {
                userId,
                hasIdentity: !!identity,
                hasMoney: !!money,
                vehicleCount: vehicles?.length || 0
            });

            return {
                identity: identity ? [identity] : [],
                money: money ? [money] : [{ cash: 0, debt: 0 }],
                vehicles: vehicles || []
            };
        }));

        const validCharacterData = characterData.filter(char => char !== null);
        console.log('Total valid characters:', validCharacterData.length);

        return {
            account: {
                id: account.id,
                adminLevel: account.adminlevel,
                salplus: account.salplus,
                aliases: JSON.parse(account.aliases),
                lastLogin: account.last_logged_in,
                banned: account.banned === 1
            },
            characters: validCharacterData
        };
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { discord_id } = JSON.parse(event.body);

        if (!discord_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Discord ID is required' })
            };
        }

        const userData = await getUserByDiscordId(discord_id);

        if (!userData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(userData)
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 