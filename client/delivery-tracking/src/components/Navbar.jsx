import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <span>{user?.name}</span>
      <button onClick={logout}>Salir</button>
    </nav>
  );
}
