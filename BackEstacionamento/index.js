const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const proprietarioRoutes = require("./routes/proprietarioRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/proprietario", proprietarioRoutes);
app.use("/veiculo", veiculoRoutes);

app.listen(8081, () => {
    console.log("Servidor rodando na porta 8081");
});