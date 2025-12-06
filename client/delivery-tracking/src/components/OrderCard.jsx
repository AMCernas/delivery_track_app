import { useNavigate } from "react-router-dom";

export default function OrderCard({ order, maxChars = 100 }) {
  const navigate = useNavigate();

  const statusColors = {
    pending: "#facc15",
    preparing: "#60a5fa",
    delivering: "#fb923c",
    delivered: "#4ade80",
  };

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  // Truncate long descriptions for card preview
  const excerpt = (text, max = maxChars) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
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

      <p className="order-details">{excerpt(order.details)}</p>

      <small className="order-date">{new Date(order.createdAt).toLocaleString()}</small>
    </div>
  );
}
