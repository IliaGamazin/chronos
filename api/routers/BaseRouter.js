import express from 'express';
import AuthRouter from "./AuthRouter.js";
import CalendarsRouter from "./CalendarsRouter.js";
import EventsRouter from "./EventsRouter.js";
import UsersRouter from "./UsersRouter.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/calendars", CalendarsRouter);
router.use("/events", EventsRouter);
router.use("/users", UsersRouter);

export default router;
