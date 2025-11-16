require("dotenv").config(); // carrega variáveis do .env
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,  // database
  process.env.DB_USER,  // username
  process.env.DB_PASS,  // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  }
);

sequelize.authenticate()
  .then(() => console.log("Conectado ao banco!"))
  .catch(err => console.log("Erro ao conectar:", err));

module.exports = sequelize;