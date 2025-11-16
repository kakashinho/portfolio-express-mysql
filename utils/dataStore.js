const Disciplina = require('../models/disciplinas');
const Projeto = require('../models/projetos');
const Dashboard = require('../models/dashboard');

let disciplinasData = [];
let projetosData = [];
let state = {}

async function carregarDados() {
    try {
        disciplinasData = await Disciplina.findAll();
        projetosData = await Projeto.findAll();
        let dashboard = await Dashboard.findOne();
        if (!dashboard) {
            dashboard = await Dashboard.create({
                githubUsername: undefined, // usa default
                languageColors: undefined // usa default
            });
        }
        state = dashboard.toJSON();
        state.LANGUAGE_COLORS = state.languageColors; // garantia consistência

        return { disciplinasData, projetosData, state };
    } catch (error) {
        console.error("Erro ao carregar dados:", error.message);
        return { disciplinasData: [], projetosData: [], state: {} };
    }
}

carregarDados();

module.exports = { carregarDados };
