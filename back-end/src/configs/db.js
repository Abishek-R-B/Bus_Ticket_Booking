import pg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false,
});

// Optional: log raw pg pool connection status
pool.connect((err, client, release) => {
  if (err) {
    console.error('Postgres connection error:', err.stack);
    return;
  }
  console.log('Successfully connected to PostgreSQL database (pg pool)!');
  release();
});

// Create a Sequelize instance so the app can use both pg pool and Sequelize.
export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // If you need ssl in production, enable here. Left false for local/dev.
    },
  }
);

export const query = (text, params) => pool.query(text, params);
export const dbPool = pool;

export default dbPool;