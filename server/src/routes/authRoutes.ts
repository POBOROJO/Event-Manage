import {Router, RequestHandler } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/authController";

const router = Router();

router.post("/register", registerHandler as RequestHandler);
router.get("/logout", logoutHandler);
router.post("/login", loginHandler as RequestHandler);

export default router;