import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

export default function authRoutes(prisma) {
  const router = Router();

  router.post("/register", (req, res) => register(req, res, prisma));
  router.post("/login", (req, res) => login(req, res, prisma));
  router.get("/me", authenticateToken, (req, res) => getMe(req, res, prisma));

  return router;
}
