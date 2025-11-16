const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inicio = sequelize.define("Inicio", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  introducao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fotoPerfil: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icones: {
    type: DataTypes.JSON,
    allowNull: false
  },
  contato: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

module.exports = Inicio;
