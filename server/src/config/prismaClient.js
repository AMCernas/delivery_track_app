import {prismaClient} from "prisma/client";
import {ENV} from "./env.js"

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: ENV.DATABASE_URL,
    },
  },
});


prisma.$on("error", (e) => {
    console.error("prisma error:", e)
});


process.on("beforeExit", async () => {
    await prisma.$disconect()
});