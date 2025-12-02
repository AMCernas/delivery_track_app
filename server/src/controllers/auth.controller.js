import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res, prisma) {
  try {
    const { email, password, name } = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, nombre y contraseña son requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (!name.trim()) {
      return res.status(400).json({ message: "El nombre no puede estar vacío" });
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message
    });
  }
}

export async function login(req, res, prisma) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user)
      return res.status(400).json({ message: "Credenciales inválidas" });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res.status(400).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message
    });
  }
}

export async function getMe(req, res, prisma) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}
