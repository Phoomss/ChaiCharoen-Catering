const express = require("express");

const authRouter = require("./authRoute");
const userRouter = require("./userRoute");

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);

module.exports = rootRouter;
