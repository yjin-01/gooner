const { Router } = require("express");

const playerController = require("../controller/playerController");

const playerRouter = Router();

playerRouter.get("/all", playerController.getAllPlayer);
playerRouter.get("/detail",playerController.getOnePlayer);
playerRouter.get("/team",playerController.getMyTeamPlayer);



module.exports = playerRouter;
