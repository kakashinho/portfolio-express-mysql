const express = require('express');
const router = express.Router();

const Dashboard = require('../models/dashboard');


router.get('/api/dashboard', async (req, res) => {
try {
        let dashboard = await Dashboard.findOne();

        // Se não existir, cria com valores default
        if (!dashboard) {
            dashboard = await Dashboard.create({});
        }

        res.json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/dashboard', async (req, res) => {
    try {
        const { githubUsername, languageColors } = req.body;

        // Remove qualquer registro antigo
        await Dashboard.destroy({ where: {} });

        const dashboard = await Dashboard.create({
            githubUsername: githubUsername || undefined, // usa default se undefined
            languageColors: languageColors || undefined  // usa default se undefined
        });

        res.status(201).json({ message: "Dashboard criado", dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/api/dashboard', async (req, res) => {
    try {
        const { githubUsername, language, color } = req.body;
        let dashboard = await Dashboard.findOne();

        if (!dashboard) {
            dashboard = await Dashboard.create({});
        }

        const updates = {};

        if (githubUsername) updates.githubUsername = githubUsername;
        if (language && color) {
            updates.languageColors = { ...dashboard.languageColors, [language]: color };
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "Nenhum dado válido enviado para atualização" });
        }

        await dashboard.update(updates);
        res.json({ message: "Dashboard atualizado", dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/dashboard/:language', async (req, res) => {
try {
        const { language } = req.params;
        const dashboard = await Dashboard.findOne();

        if (!dashboard) {
            return res.status(404).json({ error: "Dashboard não encontrado" });
        }

        if (language) {
            if (!dashboard.languageColors[language]) {
                return res.status(404).json({ error: "Linguagem não encontrada" });
            }

            const updatedColors = { ...dashboard.languageColors };
            delete updatedColors[language];

            await dashboard.update({ languageColors: updatedColors });
            return res.json({ message: `Linguagem ${language} removida`, dashboard });
        } else {
            // Se não passar linguagem, deleta todo o dashboard
            await dashboard.destroy();
            return res.json({ message: "Dashboard removido" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para apagar todas as linguagens
router.delete('/api/dashboard/', async (req, res) => {
    try {
        const dashboard = await Dashboard.findOne();

        if (!dashboard) {
            return res.status(404).json({ error: "Dashboard não encontrado" });
        }

        // Zera todas as linguagens
        await dashboard.update({ languageColors: {} });

        res.json({ message: "Todas as linguagens foram removidas", dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
