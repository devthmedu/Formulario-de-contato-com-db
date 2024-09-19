const express = require("express");
const mongoose = require("mongoose");
const porta = 80;
const app = express();

// Conexão com o MongoDB
mongoose.connect("mongodb://localhost/projectDG", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db = mongoose.connection;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get("/", (req, res) => {
    return res.sendFile(__dirname + '/public/index.html'); // Serve o index.html
});

// Rota para processar o formulário
app.post("/preencherFormulario", (req, res) => {
    const dados = {
        nome: req.body.name,
        motivo: req.body.reason,
        email: req.body.email,
        telefone: req.body.phone,
        cidade: req.body.city,
        estado: req.body.state,
        endereco: req.body.addressline,
    };

    // Inserindo os dados no MongoDB
    db.collection("usuarios").insertOne(dados, (err) => {
        if (err) {
            console.error("Erro ao inserir dados:", err);
            return res.status(500).json({ message: "Erro ao inserir dados." });
        }
        console.log("Dados inseridos com sucesso!");
        
        // Retornar os dados inseridos como JSON
        return res.json({
            message: "Dados inseridos com sucesso!",
            dados: dados
        });
    });
});

// Iniciar o servidor
app.listen(porta, () => {
    console.log(`A aplicação foi iniciada com sucesso na porta ${porta}`);
});
