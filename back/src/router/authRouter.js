import express from "express";
import { register, login, confirmEmail, forgotPassword, changePassword } from "../routes/authRoutes.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/confirm", confirmEmail);
router.post(
    '/forgot-password',
    forgotPassword,
);
router.post(
    '/reset-password/:token',
    changePassword,
);

export default router;
