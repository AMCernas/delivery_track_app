import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "",email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.name, form.email, form.password);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>

        <input
          type="name"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
