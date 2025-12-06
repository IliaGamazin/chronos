import express from "express";
const router = express.Router();

import { authenticate } from "../middleware/AuthMiddleware.js";
import {
    delete_event, get_event,
    get_events, new_event, update_event, toggle_task
} from "../controllers/EventsController.js";

router.use(authenticate);

router.get("/", get_events);
router.post("/", new_event);
router.get("/:event_id", get_event);
router.post("/:event_id/toggle_task", toggle_task);
router.patch("/:event_id", update_event);
router.delete("/:event_id", delete_event);

export default router;
