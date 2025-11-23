import {Router} from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from  "../controllers/order.controller.js"

const router = Router();

router.use(authMiddleware);

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
export default router;