const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const Dashboard = sequelize.define('Dashboard', {
    githubUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'novoUsuario'
    },
    languageColors: {
        type: DataTypes.JSON, // armazena um objeto JSON
        allowNull: false,
        defaultValue: {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'C': '#555555',
            'C++': '#f34b7d',
            'C#': '#178600',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Swift': '#ffaa45',
            'Go': '#00ADD8',
            'default': '#ededed'
        }
    }
}, {
    tableName: 'dashboard',
    timestamps: false
});

module.exports = Dashboard;
