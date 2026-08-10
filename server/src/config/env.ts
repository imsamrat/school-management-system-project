import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  supabase: {
    url: envVars.SUPABASE_URL,
    serviceKey: envVars.SUPABASE_SERVICE_KEY,
  },
  jwtSecret: envVars.JWT_SECRET,
  corsOrigin: envVars.CORS_ORIGIN,
};
