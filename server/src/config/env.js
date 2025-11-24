import "dotenv/config";

const requiredVariables = ["DATABASE_URL", "JWT_SECRET"];

requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
        console.error('Missing environment variable: ${variable}');
        process.exit(1);
    }
});

export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  NODE_ENV: process.env.NODE_ENV || "development",
};