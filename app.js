const express = require('express');
const app = express();
const port = 3000;
const sequelize = require("./config/database");
const { carregarDados } = require('./utils/dataStore');
// Torna global
global.carregarDados = carregarDados;

// Configurações EJS, middlewares
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importa routers
const inicioRouter = require('./routes/inicio');
const sobreRouter = require('./routes/sobre');
const disciplinasRouter = require('./routes/disciplinas');
const dashboardRouter = require('./routes/dashboard');
const projetosRouter = require('./routes/projetos');
const contatoRouter = require('./routes/contato');
const filesRouter = require('./routes/files');


async function getGithubStats(username, state) {
    if (username === "novoUsuario") {
        console.warn("ALERTA: O nome de usuário do GitHub ainda é o placeholder. Dados mockados serão usados.");
        return {
            username,
            repositorios: 25,
            totalCommits: 850, // Mockado
            linguagensPrincipais: [
                { name: "JavaScript", percentage: 45, color: state.LANGUAGE_COLORS['JavaScript'] },
                { name: "Python", percentage: 25, color: state.LANGUAGE_COLORS['Python'] },
                { name: "HTML/CSS", percentage: 15, color: state.LANGUAGE_COLORS['HTML'] },
                { name: "Java", percentage: 10, color: state.LANGUAGE_COLORS['Java'] },
                { name: "Outras", percentage: 5, color: state.LANGUAGE_COLORS['default'] },
            ]
        };
    }

    try {
        // 1. Busca dados do usuário (para total de repositórios)
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();

        if (userRes.status !== 200) {
            throw new Error(userData.message || "Erro ao buscar dados do usuário. O usuário existe?");
        }

        const totalRepos = userData.public_repos || 0;

        // 2. Busca repositórios (amostra de 100 para estimar linguagens)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const reposData = await reposRes.json();

        if (reposRes.status !== 200) {
            throw new Error(reposData.message || "Erro ao buscar repositórios.");
        }

        // 3. Agregação Simples de Linguagens (baseada na linguagem primária do repo)
        const languageCounts = {};
        let totalSampledRepos = 0;

        reposData.forEach(repo => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
                totalSampledRepos++;
            }
        });

        const languagesArray = Object.keys(languageCounts)
            .map(name => ({ name, count: languageCounts[name] }))
            .sort((a, b) => b.count - a.count);

        let processedLanguages = [];
        let totalPercentage = 0;
        const maxLanguages = 5;

        languagesArray.slice(0, maxLanguages).forEach(lang => {
            if (state.LANGUAGE_COLORS[lang.name]) {
                const percentage = Math.round((lang.count / totalSampledRepos) * 100);
                processedLanguages.push({
                    name: lang.name,
                    percentage,
                    color: state.LANGUAGE_COLORS[lang.name]
                });
            }
        });

        if (totalPercentage < 100) {
            processedLanguages.push({
                name: "Outras",
                percentage: 100 - totalPercentage,
                color: state.LANGUAGE_COLORS['default']
            });
        }

        const totalCommitsPlaceholder = totalRepos * 30;

        return {
            username: userData.login,
            repositorios: totalRepos,
            totalCommits: totalCommitsPlaceholder,
            linguagensPrincipais: processedLanguages
        };

    } catch (error) {
        console.error("Erro ao buscar dados do GitHub:", error.message);
        return {
            username,
            repositorios: 0,
            totalCommits: 0,
            linguagensPrincipais: [{
                name: "Erro ao Carregar Dados do GitHub",
                percentage: 100,
                color: state.LANGUAGE_COLORS['default']
            }],
            error: true
        };
    }
}

app.get('/dashboard', async (req, res) => {
    const { disciplinasData, projetosData, state } = await carregarDados();
    const totalDisciplinas = disciplinasData.length;
    const projetosConcluidos = projetosData.length;
    console.log("total de disciplinas: ",totalDisciplinas)
    console.log("total de projetos: ",projetosConcluidos)
    console.log("state: ",state)
    try {
        const githubStats = await getGithubStats(state.githubUsername, state);

        res.render('dashboard', {
            title: 'Dashboard do Portfólio',
            totalDisciplinas,
            projetosConcluidos,
            githubStats
        });
    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        res.status(500).send("Erro ao carregar dashboard.");
    }
});

// Usa routers
app.use('/', inicioRouter);
app.use('/', sobreRouter);
app.use('/', disciplinasRouter);
app.use('/', dashboardRouter);
app.use('/', projetosRouter);
app.use('/', contatoRouter);
app.use('/files', filesRouter);

// Inicia servidor somente após conectar ao banco
sequelize.sync()
    .then(() => {
        console.log("Banco sincronizado com sucesso!");
        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Erro ao sincronizar o banco:", err);
    });
