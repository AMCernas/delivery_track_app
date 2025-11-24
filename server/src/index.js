import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL,
  },
});

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


app.use("/auth", authRoutes(prisma));   
app.use("/orders", orderRoutes(prisma)); 

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export { prisma };
