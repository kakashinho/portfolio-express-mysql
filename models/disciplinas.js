const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Disciplina = sequelize.define("Disciplina", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  media: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  frequencia: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  semestre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Disciplina;