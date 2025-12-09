import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <Link to="/orders" className="dashboard-link">
          <span className="dashboard-link-icon">📦</span>
          <div className="dashboard-link-content">
            <h2>Manage Orders</h2>
            <p>View, create, and manage your orders</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
