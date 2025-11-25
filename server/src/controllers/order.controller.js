import prisma from "../prisma/client.js";

// CREATE Order
export const createOrder = async (req, res) => {
  const { title, details, status } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        title,
        details,
        status,
        userId: req.user.id,
      },
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// GET Orders (only user's orders)
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET Order by ID (only user's order)
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// UPDATE Order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { title, details, status } = req.body;

  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { title, details, status },
    });

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ message: "Error updating order" });
  }
};

// DELETE Order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Error deleting order" });
  }
};
