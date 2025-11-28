import { createContext, useState, useEffect } from "react"; 
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
            api.get("/auth/me")
              .then(res => setUser(res.data))
              .catch(() => setUser(null));
        }
    }, []);

    const login = async (ElementInternals, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const register = async (data) => {
        const res = await api.post("7auth/register", data);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}