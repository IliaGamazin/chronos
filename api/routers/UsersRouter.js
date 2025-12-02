import express from "express";
const router = express.Router();

import { me, get_user, set_avatar, update_user } from  "../controllers/UsersController.js"
import { authenticate } from "../middleware/AuthMiddleware.js";

router.use(authenticate);

router.get("/me", me);
router.get("/:user_id", get_user);
router.patch("/avatar", set_avatar);
router.patch("/", update_user);

export default router;
