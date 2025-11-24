import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "/prisma/schema.prisma",

  datasource: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },

  client: {
    engine: "library",
    adapter: {
      provider: "postgresql",
      connectionString: process.env.DATABASE_URL,
    },
  },
};

