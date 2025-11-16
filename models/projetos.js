const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Projeto = sequelize.define('Projeto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imgSrc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    htmlSrc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'projetos',
    timestamps: true 
});

module.exports = Projeto;
