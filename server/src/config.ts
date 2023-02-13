import dotenv from 'dotenv';
dotenv.config();


export type Config = typeof config

export const config = {
  PORT: Number(process.env.PORT) || 3000,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379"
}
