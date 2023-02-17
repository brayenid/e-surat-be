import dotenv from 'dotenv'
dotenv.config()

const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  token: {
    access: process.env.ACCESS_TOKEN,
    refresh: process.env.REFRESH_TOKEN,
    maxAge: process.env.MAX_AGE
  }
}

export default config
