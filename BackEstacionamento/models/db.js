const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("estacionamento", "postgres", "root", {
    host: "localhost",
    dialect: "postgres",
    port: 5432
});

module.exports = {
    Sequelize,
    sequelize
};