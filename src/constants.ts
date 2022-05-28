// BACKEND SERVER
export const SERVER_PORT = process.env.PORT || 3000

// POSTGRESQL SEVRER
export const DATABASE_NAME = process.env.DATABASE_NAME || 'codica-tt'
export const DATABASE_PORT = +process.env.DATABASE_PORT || 5432
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres'
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'pg_8008'
export const DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1'

// TRANSFER WEBHOOK SERVER
export const WEBHOOK_API = 'abcdefghijklmnopqrstuvwxyz'
export const WEBHOOK_API_CONFIG = {
  type: 'application/json',
  auth: {
    username: 'abcd',
    password: 'efgi'
  }
}