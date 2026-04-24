import { Sequelize } from "sequelize";
import env from "./env.config.js";

const sequelize = new Sequelize(
  env.MYSQL.DATABASE,
  env.MYSQL.USER,
  env.MYSQL.PASSWORD,
  {
    host: env.MYSQL.HOST,
    dialect: "mysql",

    logging: false, // bật true nếu debug SQL

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    timezone: "+07:00",
  }
);

export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected");
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    process.exit(1);
  }
};

export default sequelize;
