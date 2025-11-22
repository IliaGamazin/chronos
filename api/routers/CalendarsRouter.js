import express from "express";
const router = express.Router();

import { get_calendars, get_calendar, new_calendar,
    update_calendar, delete_calendar
} from "../controllers/CalendarsController.js";
import { authenticate } from "../middleware/AuthMiddleware.js";

router.get("/", authenticate, get_calendars);
router.get("/:calendar_id", authenticate, get_calendar);
router.post("/", authenticate, new_calendar);
router.patch("/", authenticate, update_calendar);
router.delete("/", authenticate, delete_calendar);

export default router;
