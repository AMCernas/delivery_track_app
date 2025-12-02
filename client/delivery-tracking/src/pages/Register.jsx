import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "",email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!form.email.trim()) {
      setError("El email es requerido");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email inválido");
      return false;
    }
    if (!form.password) {
      setError("La contraseña es requerida");
      return false;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>

        <input
          type="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Ingresar"}</button>
      </form>
    </div>
  );
}
