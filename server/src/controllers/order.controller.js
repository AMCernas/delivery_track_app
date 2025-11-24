export async function getOrders(req, res, prisma) {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId }
    });

    return res.json({ orders });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function createOrder(req, res, prisma) {
  try {
    const userId = req.user.id;
    const { product, total } = req.body;

    const order = await prisma.order.create({
      data: { product, total, userId }
    });

    return res.status(201).json({
      message: "Order created",
      order
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function getOrderById(req, res, prisma) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId }
    });

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    return res.json({ order });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function updateOrder(req, res, prisma) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { product, total } = req.body;

    const existing = await prisma.order.findFirst({
      where: { id: Number(id), userId }
    });

    if (!existing)
      return res.status(404).json({ message: "Order not found" });

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { product, total }
    });

    return res.json({
      message: "Order updated",
      order: updated
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export async function deleteOrder(req, res, prisma) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.order.findFirst({
      where: { id: Number(id), userId }
    });

    if (!existing)
      return res.status(404).json({ message: "Order not found" });

    await prisma.order.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Order deleted" });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}
