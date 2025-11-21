import express from "express";
const router = express.Router();

import { register, login, logout, refresh } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/AuthMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
// router.post("/password-reset", reset_link);
// router.post("/password-reset/:confirm_token", reset_confirm);
router.post("/refresh", refresh);

export default router;
