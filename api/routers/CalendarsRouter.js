import express from "express";
const router = express.Router();

import {
    get_calendars, get_calendar, new_calendar, invite,
    update_calendar, delete_calendar, invite_accept
} from "../controllers/CalendarsController.js";
import { authenticate } from "../middleware/AuthMiddleware.js";

router.use(authenticate);

router.get("/", get_calendars);
router.post("/", new_calendar);

router.get("/:calendar_id", get_calendar);
router.post("/:calendar_id/invite", invite);
router.post("/invite/:token", invite_accept);
router.patch("/:calendar_id", update_calendar);
router.delete("/:calendar_id", delete_calendar);
router.delete("/:calendar_id/unfollow", delete_calendar);
router.delete("/:calendar_id/:user_id", delete_calendar);

export default router;
