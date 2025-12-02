import { createContext, useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // 👈 added

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            api.get("/auth/me")
                .then(res => setUser(res.data))
                .catch(() => setUser(null));
        }
    }, []);

    const login = async (email, password) => {   // 👈 fixed param
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        navigate("/dashboard"); // 👈 optional: redirect after login
    };

    const register = async (data) => {
        const res = await api.post("/auth/register", data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        navigate("/dashboard"); // 👈 redirect after register
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);

        navigate("/login"); // 👈 optional
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
