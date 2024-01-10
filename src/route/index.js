const { Router } = require('express');
const  userRouter = require("./userRoute");
const playerRouter = require("./playerRoute");

const router = Router();

router.use("/user", userRouter);
router.use("/player",playerRouter);

module.exports = router ;
