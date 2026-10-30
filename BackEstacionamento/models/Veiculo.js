const db = require("./db");

const Veiculo = db.sequelize.define("veiculo", {
    id_veiculo: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    placa: {
        type: db.Sequelize.TEXT
    },
    ano: {
        type: db.Sequelize.INTEGER
    },
    mensalidade: {
        type: db.Sequelize.DECIMAL(10, 2)
    },
    fk_proprietario: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "proprietario",
            key: "id_proprietario"
        },
        onDelete: "CASCADE"
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Veiculo;