import express from 'express';
import AuthRouter from "./AuthRouter.js";
import CalendarsRouter from "./CalendarsRouter.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/calendars", CalendarsRouter);

export default router;
