import express from 'express';
import AuthRouter from "./AuthRouter.js";
import CalendarsRouter from "./CalendarsRouter.js";
import EventsRouter from "./EventsRouter.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/calendars", CalendarsRouter);
router.use("/events", EventsRouter);

export default router;
