const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

const router = express.Router();

const BASE_DIR = path.join(__dirname, '../public');

// Subpastas permitidas
const ALLOWED_FOLDERS = ['css', 'docs', 'img', 'templates'];

// Middleware para validar a pasta
function validateFolder(req, res, next) {
    const folder = req.params.folder;

    if (!ALLOWED_FOLDERS.includes(folder)) {
        return res.status(400).json({
            error: `Pasta inválida. Use: ${ALLOWED_FOLDERS.join(', ')}`
        });
    }

    req.folderPath = path.join(BASE_DIR, folder);

    if (!fs.existsSync(req.folderPath)) {
        fs.mkdirSync(req.folderPath, { recursive: true });
    }

    next();
}

// Configuração Multer dinâmica
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, req.folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


// POST /files/upload/:folder
router.post('/upload/:folder', validateFolder, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado" });
    res.json({
        message: "Upload concluído",
        file: req.file.filename,
        folder: req.params.folder
    });
});


// GET /files/list/:folder
router.get('/list/:folder', validateFolder, (req, res) => {
    fs.readdir(req.folderPath, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ folder: req.params.folder, files });
    });
});


// DELETE /files/delete/:folder/:filename
router.delete('/delete/:folder/:filename', validateFolder, (req, res) => {
    const filePath = path.join(req.folderPath, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Arquivo deletado" });
    });
});


// PUT /files/rename/:folder/:filename
router.put('/rename/:folder/:filename', validateFolder, (req, res) => {
    const { newName } = req.body;
    if (!newName) return res.status(400).json({ error: "Novo nome não informado" });

    const oldPath = path.join(req.folderPath, req.params.filename);
    const newPath = path.join(req.folderPath, newName);

    if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Arquivo renomeado", newName });
    });
});


// PUT /files/edit/:folder/:filename
// Body: { "content": "novo conteúdo aqui" }
router.put('/edit/:folder/:filename', validateFolder, (req, res) => {
    const { content } = req.body;
    if (content === undefined) {
        return res.status(400).json({ error: "Conteúdo não enviado" });
    }

    const filePath = path.join(req.folderPath, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Arquivo atualizado com sucesso" });
    });
});

// GET /files/open/:folder/:filename
// Abre o arquivo no Visual Studio Code
router.get('/open/:folder/:filename', validateFolder, (req, res) => {
    const filePath = path.join(req.folderPath, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    // Executa comando para abrir no VS Code
    exec(`code "${filePath}"`, (err) => {
        if (err) {
            return res.status(500).json({
                error: "Não foi possível abrir o arquivo no VS Code",
                details: err.message
            });
        }

        res.json({
            message: "Arquivo aberto no Visual Studio Code",
            file: req.params.filename
        });
    });
});

module.exports = router;
