const { Router } = require('express');
const  userRouter = require("./userRoute");

const router = Router();

router.use("/user", userRouter);

//test용

// router.get('/', (req, res, next) => {
//   res.send('Hello World');
// });

module.exports = router ;
