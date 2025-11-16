const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sobre = sequelize.define("Sobre", {
  fotoDescontraida: {
    type: DataTypes.STRING,
    allowNull: false
  },
  informacoesAluno: {
    type: DataTypes.JSON,
    allowNull: false
  },
  textoSobre: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Sobre;
