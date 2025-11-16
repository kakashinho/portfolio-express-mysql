const express = require('express');
const router = express.Router();
const { projetosData } = require('../utils/dataStore');
const Projeto = require('../models/projetos');

router.get('/api/projetos', async (req, res) => {
    try {
        const projetos = await Projeto.findAll();
        res.json(projetos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/api/projetos', async (req, res) => {
    try {
        const projetos = req.body;

        if (!Array.isArray(projetos)) {
            return res.status(400).json({ error: "O corpo deve ser um array de projetos" });
        }

        for (const [i, p] of projetos.entries()) {
            const { nome, descricao, imgSrc, htmlSrc } = p;
            if (!nome || !descricao || !imgSrc || !htmlSrc) {
                return res.status(400).json({ error: `Campos obrigatórios ausentes no projeto na posição ${i}` });
            }
        }

        // Verifica duplicatas pelo nome
        const nomesExistentes = (await Projeto.findAll({ attributes: ['nome'] }))
            .map(p => p.nome.toLowerCase());

        const novosProjetos = projetos.filter(p => !nomesExistentes.includes(p.nome.toLowerCase()));

        if (novosProjetos.length === 0) {
            return res.status(400).json({ error: "O projeto já existe no banco." });
        }

        const criados = await Projeto.bulkCreate(novosProjetos.map((p, i) => ({
            nome: p.nome,
            descricao: p.descricao,
            imgSrc: p.imgSrc,
            htmlSrc: p.htmlSrc
        })));

        res.status(201).json({
            message: "Projetos adicionados com sucesso!",
            adicionados: criados.length
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/api/projetos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, imgSrc, htmlSrc } = req.body;

        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await projeto.update({
            nome: nome || projeto.nome,
            descricao: descricao || projeto.descricao,
            imgSrc: imgSrc || projeto.imgSrc,
            htmlSrc: htmlSrc || projeto.htmlSrc
        });

        res.json(projeto);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/projetos/:id', async (req, res) => {
try {
        const { id } = req.params;
        const projeto = await Projeto.findByPk(id);

        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await projeto.destroy();

        res.json({ message: "Projeto removido", projeto });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/projetos', async (req, res) => {
    try {
        const quantidade = await Projeto.count(); // contar quantos projetos existem
        if (quantidade === 0) {
            return res.status(404).json({ message: "Nenhum projeto para deletar." });
        }

        await Projeto.destroy({ where: {} });

        res.json({ message: `Todos os ${quantidade} projetos foram removidos.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/projetos', async (req, res) => {
    try {
        const projetos = await Projeto.findAll();
        res.render('projetos', {
            title: 'Projetos',
            projetos
        });
    } catch (error) {
        res.status(500).send("Erro ao renderizar página de projetos.");
    }
});


module.exports = router;