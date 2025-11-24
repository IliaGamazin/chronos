import express from "express";
const router = express.Router();

import {
    get_calendars, get_calendar, new_calendar, invite,
    update_calendar, delete_calendar, invite_accept
} from "../controllers/CalendarsController.js";
import { authenticate } from "../middleware/AuthMiddleware.js";

router.get("/", authenticate, get_calendars);
router.get("/:calendar_id", authenticate, get_calendar);
router.post("/", authenticate, new_calendar);
router.patch("/", authenticate, update_calendar);
router.delete("/", authenticate, delete_calendar);

router.post("/:calendar_id/invite", authenticate, invite);
router.post("/invite/:token", authenticate, invite_accept);

export default router;
