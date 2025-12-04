import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      toast.error("Error cargando la orden");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${id}`, {
        ...order,
        status: newStatus,
      });
      setOrder(res.data);
      toast.success("Estado actualizado");
    } catch (err) {
      toast.error("Error actualizando el estado");
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta orden?")) {
      try {
        await api.delete(`/orders/${id}`);
        toast.success("Orden eliminada");
        navigate("/orders");
      } catch (err) {
        toast.error("Error eliminando la orden");
      }
    }
  };

  const statusColors = {
    pending: "#facc15",
    preparing: "#60a5fa",
    delivering: "#fb923c",
    delivered: "#4ade80",
  };

  const statusOptions = ["pending", "preparing", "delivering", "delivered"];

  if (loading) {
    return <div className="order-details-loading">Cargando...</div>;
  }

  if (!order) {
    return <div className="order-details-error">Orden no encontrada</div>;
  }

  return (
    <div className="order-details">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate("/orders")}>
        ← Volver
      </button>

      <div className="order-details-container">
        <h1>{order.title}</h1>

        <div className="order-info">
          <div className="info-field">
            <label>ID:</label>
            <p>{order.id}</p>
          </div>

          <div className="info-field">
            <label>Estado Actual:</label>
            <span
              className="status-badge-large"
              style={{ backgroundColor: statusColors[order.status] }}
            >
              {order.status}
            </span>
          </div>

          <div className="info-field">
            <label>Detalles:</label>
            <p className="details-text">{order.details}</p>
          </div>

          <div className="info-field">
            <label>Fecha de Creación:</label>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="order-actions">
          <h2>Cambiar Estado</h2>
          <div className="status-buttons">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`btn btn-sm status-button ${order.status === status ? "active" : ""}`}
                onClick={() => updateStatus(status)}
                disabled={updating || order.status === status}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="order-danger">
          <button
            className="btn btn-danger"
            onClick={deleteOrder}
            disabled={updating}
          >
            Eliminar Orden
          </button>
        </div>
      </div>
    </div>
  );
}
