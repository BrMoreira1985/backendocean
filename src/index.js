require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.BD_URL });
const port = process.env.PORT || 3001;
const client = require("twilio")(
  "ACfbfaa6b33b177de40aeba23cc1b3a78c",
  "e21f948a810b676326e304e683d274d8"
);

app.use(express.json());
app.use(cors());

app.get("/clientes", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clientes");
    return res.status(200).send(rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get("/", (req, res) => {
  try {
    return res.status(200).send("hello there");
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.post("/sessao", async (req, res) => {
  const { nome_cliente } = req.body;
  const { cpf } = req.body;
  const { rua } = req.body;
  const { numero } = req.body;
  const { complemento } = req.body;
  const { bairro } = req.body;
  const { cep } = req.body;
  const { cidade } = req.body;
  const { estado } = req.body;

  try {
    const novaSessao = await pool.query(
      "INSERT INTO clientes (nome_cliente, cpf, rua, numero, complemento, bairro, cep, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [nome_cliente, cpf, rua, numero, complemento, bairro, cep, cidade, estado]
    );
    return res.status(200).send(novaSessao.rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`escutando na porta ${port}`);
});
