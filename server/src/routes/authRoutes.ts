import {Router, RequestHandler } from "express";
import { guestLoginHandler, loginHandler, logoutHandler, registerHandler } from "../controllers/authController";

const router = Router();

router.post("/register", registerHandler as RequestHandler);
router.post("/login", loginHandler as RequestHandler);
router.post("/guest", guestLoginHandler as RequestHandler);
router.get("/logout", logoutHandler);

export default router;