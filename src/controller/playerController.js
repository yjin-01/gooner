const playerService = require('../service/playerService');
const resHandler = require('../util/resHandler');

module.exports = {
    getAllPlayer: async (req, res) => {
        try {
            const players = await playerService.getAllPlayer();
            resHandler.SuccessResponse(res, players, 200);
        } catch (err) {
            console.error(err);
            resHandler.FailedResponse(res, err.stack, 500);
        }
    },

    getOnePlayer : async (req,res) =>{
        try{
            const {playerId} = req.query;
            const player = await playerService.getOnePlayer(playerId);

            if(!player) return resHandler.FailedResponse(res,"Player were not found",400);

            resHandler.SuccessResponse(res,player,200);
        }catch (err) {
            console.error(err);
            resHandler.FailedResponse(res,err.stack, 500);
        }
    }
};
