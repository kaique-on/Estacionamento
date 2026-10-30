const Veiculo = require("../models/Veiculo");

exports.listar = async (req, res) => {
    try {
        const veiculos = await Veiculo.findAll();
        res.json(veiculos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.buscar = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);

        if (!veiculo) {
            return res.status(404).json({ erro: "Veículo não encontrado" });
        }

        res.json(veiculo);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const veiculo = await Veiculo.create(req.body);
        res.status(201).json(veiculo);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);

        if (!veiculo) {
            return res.status(404).json({ erro: "Veículo não encontrado" });
        }

        await veiculo.update(req.body);
        res.json(veiculo);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.excluir = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);

        if (!veiculo) {
            return res.status(404).json({ erro: "Veículo não encontrado" });
        }

        await veiculo.destroy();
        res.json({ mensagem: "Veículo excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};