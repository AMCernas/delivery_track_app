import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
  <>
    <h1>Dashboard protegido</h1>
    <Link to="/orders">Manage Orders</Link>

  </>

  )
}
