// CREATE Order
export const createOrder = async (req, res, prisma) => {
  const { title, details, status = "pending" } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        title,
        details,
        status,
        userId: req.userId,
      },
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// GET Orders
export const getOrders = async (req, res, prisma) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET Order by ID
export const getOrderById = async (req, res, prisma) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.userId },
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
export const updateOrder = async (req, res, prisma) => {
  const { id } = req.params;
  const { title, details, status } = req.body;

  try {
    // Validar que la orden pertenece al usuario
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.userId },
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Validar que al menos un campo esté siendo actualizado
    if (!title && !details && !status) {
      return res.status(400).json({ message: "Al menos un campo debe ser actualizado" });
    }

    // Validar estado si es proporcionado
    const validStatuses = ["pending", "preparing", "delivering", "delivered"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(details && { details }),
        ...(status && { status }),
      },
    });

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ message: "Error actualizando la orden" });
  }
};;

// DELETE Order
export const deleteOrder = async (req, res, prisma) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.userId },
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    await prisma.order.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Orden eliminada exitosamente" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Error eliminando la orden" });
  }
};
