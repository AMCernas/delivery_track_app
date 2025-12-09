import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderCard from "./OrderCard";
import { toast } from "react-hot-toast";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Error cargando pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="order-list">
        <p>Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <p>No hay pedidos aún</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))
      )}
    </div>
  );
}
