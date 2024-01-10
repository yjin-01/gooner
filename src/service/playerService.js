const playerModel = require("../model/player");
const logger = require("../util/logger");

module.exports = {
    getAllPlayer: async () => {
        try {
            const players = await playerModel.getAllPlayer();
            return players;
        } catch (err) {
            console.error(err);
            logger.error("Error : ", err.stack);
            return null;
        }
    },

    getOnePlayer : async(playerId) =>{
        try {
            const player = await playerModel.getOnePlayer(playerId);
            return player;
        }catch (err) {
            console.log(err);
            logger.error("getOnePlayer Service Error : ", err.stack);
            return null;
        }
    }
}