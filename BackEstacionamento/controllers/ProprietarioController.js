const Proprietario = require("../models/Proprietario");

exports.listar = async (req, res) => {
    try {
        const proprietarios = await Proprietario.findAll();
        res.json(proprietarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.buscar = async (req, res) => {
    try {
        const proprietario = await Proprietario.findByPk(req.params.id);

        if (!proprietario) {
            return res.status(404).json({ erro: "Proprietário não encontrado" });
        }

        res.json(proprietario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const proprietario = await Proprietario.create(req.body);
        res.status(201).json(proprietario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const proprietario = await Proprietario.findByPk(req.params.id);

        if (!proprietario) {
            return res.status(404).json({ erro: "Proprietário não encontrado" });
        }

        await proprietario.update(req.body);
        res.json(proprietario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.excluir = async (req, res) => {
    try {
        const proprietario = await Proprietario.findByPk(req.params.id);

        if (!proprietario) {
            return res.status(404).json({ erro: "Proprietário não encontrado" });
        }

        await proprietario.destroy();
        res.json({ mensagem: "Proprietário excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};