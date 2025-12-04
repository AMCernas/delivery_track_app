import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const statusColors = {
    pending: "#facc15",
    preparing: "#60a5fa",
    delivering: "#fb923c",
    delivered: "#4ade80"
  };

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div
      className="order-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="order-header">
        <h3>{order.title}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[order.status] }}
        >
          {order.status}
        </span>
      </div>

      <p className="order-details">
        {order.details}
      </p>

      <small className="order-date">
        {new Date(order.createdAt).toLocaleString()}
      </small>
    </div>
  );
}
