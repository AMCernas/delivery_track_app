import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from "../controllers/order.controller.js";

export default function orderRoutes(prisma) {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", (req, res) => getOrders(req, res, prisma));
  router.post("/", (req, res) => createOrder(req, res, prisma));
  router.get("/:id", (req, res) => getOrderById(req, res, prisma));
  router.put("/:id", (req, res) => updateOrder(req, res, prisma));
  router.delete("/:id", (req, res) => deleteOrder(req, res, prisma));

  return router;
}
