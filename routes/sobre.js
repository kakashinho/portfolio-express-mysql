const express = require('express');
const router = express.Router();

const Sobre = require('../models/sobre');

router.post('/api/sobre', async (req, res) => {
  try {
    const { fotoDescontraida, informacoesAluno, textoSobre } = req.body;

    if (!fotoDescontraida || !informacoesAluno || !textoSobre) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    //Apaga o anterior
    await Sobre.destroy({ where: {} });

    const sobre = await Sobre.create({
      fotoDescontraida,
      informacoesAluno,
      textoSobre
    });

    res.status(201).json({ message: "Dados salvos com sucesso!", sobre });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/sobre', async (req, res) => {
  try {
    const sobre = await Sobre.findOne();
    if (!sobre) {
      return res.status(404).json({ message: "Nenhum dado encontrado." });
    }

    res.json(sobre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/sobre', async (req, res) => {
try {
    const sobre = await Sobre.findOne();
    if (!sobre) {
      return res.status(404).json({ error: "Nenhum dado para atualizar." });
    }

    const { fotoDescontraida, informacoesAluno, textoSobre } = req.body;

    const updates = {};

    if (fotoDescontraida !== undefined && fotoDescontraida !== "")
      updates.fotoDescontraida = fotoDescontraida;

    if (informacoesAluno !== undefined && informacoesAluno !== "")
      updates.informacoesAluno = informacoesAluno;

    if (textoSobre !== undefined && textoSobre !== "")
      updates.textoSobre = textoSobre;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Nenhum dado válido enviado para atualização." });
    }

    await sobre.update(updates);

    res.json({ message: "Atualizado com sucesso!", sobre });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/sobre', async (req, res) => {
  try {
    const sobre = await Sobre.findOne();
    if (!sobre) {
      return res.status(404).json({ error: "Nenhum dado para deletar." });
    }

    await sobre.destroy();

    res.json({ message: "Dados apagados com sucesso." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Página sobre
router.get('/sobre', async (req, res) => {
  try {
    const sobreData = await Sobre.findOne();

    let data = sobreData ? sobreData.toJSON() : {};

    if (!Array.isArray(data.informacoesAluno)) {
      data.informacoesAluno = [];
    }

    res.render('sobre', { sobreData: data });

  } catch (error) {
    res.status(500).send("Erro ao renderizar página 'Sobre'.");
  }
});

module.exports = router;