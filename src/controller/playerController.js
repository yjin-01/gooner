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
};
