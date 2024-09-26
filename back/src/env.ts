import z from 'zod';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'test' ? '.testing.env' : '.env';
dotenv.config({ path: resolve(__dirname, envFile) });

const envSchema = z.object({
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET_KEY: z.string(),
});

export const env = {
  ...envSchema.parse(process.env),
  DB_URL: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};
