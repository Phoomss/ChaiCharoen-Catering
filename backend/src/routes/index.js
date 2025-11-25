const express = require("express");

const authRouter = require("./authRoute");
const userRouter = require("./userRoute");
const menuRouter = require("./menuRoute")
const setPackageRouter = require("./setPackageRoute")
const bookingRouter = require("./bookingRoute");
const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/menus", menuRouter)
rootRouter.use("/set-packages", setPackageRouter)
rootRouter.use("/bookings", bookingRouter);
module.exports = rootRouter;
