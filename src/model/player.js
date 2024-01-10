const db = require("../loader/db");
const logger = require("../util/logger");

module.exports = {
    // 모든 플레이어 검색
    getAllPlayer: async () => {
        let connection;
        try {
            const query = `SELECT * FROM players`;
            connection = await db.getConnection();

            const users = await executeQuery(connection, query);

            return users[0];
        } catch (err) {
            logger.error("model Error : ", err.stack);
            console.error("Error", err.message);
            return err;
        } finally {
            if (connection) {
                await db.releaseConnection(connection);
            }
        }
    },

    // 특정 플레이어 검색
    getOnePlayer : async (playerId) =>{
        let connection;
        try {
            const query = `SELECT * FROM players WHERE player_id = ${playerId}`;
            connection = await db.getConnection();

            const player = await executeQuery(connection, query);

            return player[0];
        } catch (err) {
            logger.error("getOnePlayer Model Error : ", err.stack);
            console.error("Error", err.message);
            return err;
        } finally {
            if (connection) {
                await db.releaseConnection(connection);
            }
        }
    },

    getMyTeamPlayer : async (clubId) => {
        let connection;
        try {
            const query = `
            SELECT * FROM players 
            WHERE 1 = 1 
                AND club_id = ${clubId}
                `;
            connection = await db.getConnection();

            const player = await executeQuery(connection, query);

            return player[0];
        } catch (err) {
            logger.error("getOnePlayer Model Error : ", err.stack);
            console.error("Error", err.message);
            return err;
        } finally {
            if (connection) {
                await db.releaseConnection(connection);
            }
        }
    }
}

async function executeQuery(connection, query) {
    try {
        const results = await connection.query(query);
        return results;
    } catch (error) {
        throw error;
    }
}