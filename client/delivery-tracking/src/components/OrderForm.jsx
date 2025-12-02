import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function OrderForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/orders", { title, details, status: "pending" });
      onCreate(res.data); 
      setTitle("");
      setDetails("");
      toast.success("Pedido creado!");
    } catch (err) {
      toast.error("Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <input
        type="text"
        placeholder="Título del pedido"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Detalles"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear pedido"}
      </button>
    </form>
  );
}
