const express = require('express');
const router = express.Router();

const Disciplina = require('../models/disciplinas');

function padronizarStatus(disciplinas) {
    return disciplinas.map(d => {
        if (d.status.toLowerCase().includes('aprovado')) {
            d.status = 'Concluída';
        } else if (d.status.toLowerCase().includes('curso') && d.status.length < 15) {
            d.status = 'Em Curso';
        } else if (d.status.toLowerCase().includes('não cursada')) {
            d.status = 'Não Cursada';
        }
        return d;
    });
}

router.get('/api/disciplinas', async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll();
        res.json(disciplinas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/disciplinas', async (req, res) => {
    try {
        const disciplinas = req.body;

        if (!Array.isArray(disciplinas)) {
            return res.status(400).json({ error: "O corpo deve ser um ARRAY de disciplinas." });
        }

        // Validação
        for (let i = 0; i < disciplinas.length; i++) {
            const d = disciplinas[i];
            if (!d.nome || d.media == null || d.frequencia == null || !d.semestre || !d.ano || !d.status) {
                return res.status(400).json({
                    error: `Disciplina na posição ${i} está incompleta.`
                });
            }
        }

        const disciplinaPadronizadas = padronizarStatus(disciplinas);

        const nomesExistentes = (await Disciplina.findAll({ attributes: ['nome'] }))
            .map(d => d.nome.toLowerCase());

        const novasDisciplinas = disciplinaPadronizadas.filter(d => !nomesExistentes.includes(d.nome.toLowerCase()));

        if (novasDisciplinas.length === 0) {
            return res.status(400).json({ error: "A disciplina já existe no banco." });
        }

        const criadas = await Disciplina.bulkCreate(disciplinaPadronizadas);

        res.status(201).json({
            message: "Disciplinas adicionadas com sucesso!",
            adicionadas: criadas.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/api/disciplinas/:nome', async (req, res) => {
    try {
        const nomeParam = decodeURIComponent(req.params.nome).toLowerCase();

        const disciplina = await Disciplina.findOne({
            where: { nome: nomeParam }
        });

        if (!disciplina) {
            return res.status(404).json({ error: "Disciplina não encontrada." });
        }

        const updates = {};
        const body = req.body;

        if (body.nome !== undefined && body.nome !== "") updates.nome = body.nome;
        if (body.media !== undefined && body.media !== "") updates.media = body.media;
        if (body.frequencia !== undefined && body.frequencia !== "") updates.frequencia = body.frequencia;
        if (body.semestre !== undefined && body.semestre !== "") updates.semestre = body.semestre;
        if (body.ano !== undefined && body.ano !== "") updates.ano = body.ano;
        if (body.status !== undefined && body.status !== "") updates.status = body.status;

        await disciplina.update(updates);

        res.json({ message: "Disciplina atualizada com sucesso!", disciplina });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/disciplinas/:nome', async (req, res) => {
    try {
        const nomeParam = decodeURIComponent(req.params.nome).toLowerCase();

        const disciplina = await Disciplina.findOne({
            where: { nome: nomeParam }
        });

        if (!disciplina) {
            return res.status(404).json({ error: "Disciplina não encontrada." });
        }

        await disciplina.destroy();

        res.json({ message: "Disciplina removida com sucesso!", removida: disciplina });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/disciplinas', async (req, res) => {
    try {
        await Disciplina.destroy({ where: {} });
        res.json({ message: "Todas as disciplinas foram removidas." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/disciplinas', async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll();
        const prioridadeStatus = { 'Concluída': 1, 'Em Curso': 2, 'Não Cursada': 3 };

        // Ordena pelo status
        disciplinas.sort((a, b) => {
            return (prioridadeStatus[a.status] || 99) - (prioridadeStatus[b.status] || 99);
        });

        res.render('disciplinas', {
            title: 'Minhas Disciplinas',
            disciplinas
        });
    } catch (error) {
        res.status(500).send("Erro ao carregar página de disciplinas.");
    }
});

module.exports = router;
