import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5001,

  MYSQL: {
    HOST: process.env.MYSQL_HOST || "localhost",
    USER: process.env.MYSQL_USER || "root",
    PASSWORD: process.env.MYSQL_PASSWORD || "123456",
    DATABASE: process.env.MYSQL_DATABASE || "ecommerce_computer",
  },

  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce_chat",

  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  GOONG: {
    API_KEY: process.env.GOONG_API_KEY || "",
  },
};

export default env;
