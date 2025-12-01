const express = require("express");

const authRouter = require("./authRoute");
const userRouter = require("./userRoute");
const menuRouter = require("./menuRoute")
const menuPackageRouter = require("./menuPackageRoute")
const bookingRouter = require("./bookingRoute");
const reviewRouter = require("./reviewRoute");
const customerRouter = require("./customerRoute");
const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/menus", menuRouter)
rootRouter.use("/menu-packages", menuPackageRouter)
rootRouter.use("/bookings", bookingRouter);
rootRouter.use("/reviews", reviewRouter);
rootRouter.use("/customer", customerRouter);
module.exports = rootRouter;
