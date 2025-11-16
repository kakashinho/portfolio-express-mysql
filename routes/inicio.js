const express = require('express');
const router = express.Router();

const Inicio = require("../models/inicio");

router.post('/api/inicio', async (req, res) => {
    try {
        const { nome, introducao, fotoPerfil, icones, contato } = req.body;

        if (!nome || !introducao || !fotoPerfil || !icones || !contato) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }
        //Apaga o anterior
        await Inicio.destroy({ where: {} });

        const inicio = await Inicio.create({ nome, introducao, fotoPerfil, icones, contato });
        res.status(201).json({ message: "Dados salvos com sucesso!", inicio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/inicio', async (req, res) => {
    try {
        const inicio = await Inicio.findOne();
        if (!inicio) {
            return res.status(404).json({ message: "Nenhum dado encontrado." });
        }
        res.json(inicio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/api/inicio', async (req, res) => {
    try {
        const inicio = await Inicio.findOne();

        if (!inicio) {
            return res.status(404).json({ error: "Nenhum dado para atualizar." });
        }
        const { nome, introducao, fotoPerfil, icones, contato } = req.body;

        const updates = {};

        if (nome !== undefined && nome !== "") updates.nome = nome;
        if (introducao !== undefined && introducao !== "") updates.introducao = introducao;
        if (fotoPerfil !== undefined && fotoPerfil !== "") updates.fotoPerfil = fotoPerfil;
        if (icones !== undefined && icones !== "") updates.icones = icones;
        if (contato !== undefined && contato !== "") updates.contato = contato;
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "Nenhum dado válido enviado para atualização." });
        }

        await inicio.update(updates);
        res.json({ message: "Atualizado com sucesso!", inicio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/api/inicio', async (req, res) => {
    try {
        const inicio = await Inicio.findOne();
        if (!inicio) {
            return res.status(404).json({ error: "Nenhum dado para deletar." });
        }

        await inicio.destroy();

        res.json({ message: "Dado apagado com sucesso." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota da página inicial
router.get('/', async (req, res) => {
    try {
        const inicioData = await Inicio.findOne();
        res.render('index', { inicioData: inicioData || {} });

    } catch (error) {
        res.status(500).send("Erro ao renderizar página inicial.");
    }
});

module.exports = router;