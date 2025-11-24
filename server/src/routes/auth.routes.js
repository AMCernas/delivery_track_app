import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

export default function authRoutes(prisma) {
  const router = Router();

  router.post("/register", (req, res) => register(req, res, prisma));
  router.post("/login", (req, res) => login(req, res, prisma));

  return router;
}
