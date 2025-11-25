import { PrismaClient } from "@prisma/client";
import { ENV } from "./env.js";

const clientOptions = {};
if (ENV.DATABASE_URL) {
  clientOptions.datasources = {
    db: {
      url: ENV.DATABASE_URL,
    },
  };
}

let prisma;
// Prevent creating new client during hot-reload in development
if (process.env.NODE_ENV === "development") {
  if (!global.prisma) {
    global.prisma = new PrismaClient(clientOptions);
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient(clientOptions);
}

prisma.$on("error", (e) => {
  console.error("prisma error:", e);
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;