const express = require('express');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');

//Configuração do body-parser
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())

//Configuração do handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//Public
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    res.locals.usuario = true;
    next();
})

const port = 8888;
const host = "localhost"


app.get("/", (req, res) => {
    res.redirect("/login");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/home", (req, res) => {
    res.render("home");
})

app.get("/funcionario/add_funcionario", (req, res) => {
    res.render("funcionario/add_funcionario");
})

app.get("/funcionario/busca_funcionario", (req, res) => {
    res.render("funcionario/busca_funcionario");
})

app.get("/funcionario/busca_funcionario/:busca", (req, res) => {
    funcionarios = [];
    novoFuncionario = {
        first_name: "Pessoa",
        last_name: "da Terra",
        user_name: "pessoadaterra",
        phone: "(88) 99999-9999",
        SSN: "123456789"
    }
    funcionarios.push(novoFuncionario)
    res.render("funcionario/busca_funcionario", {funcionarios: funcionarios});
})

app.get("/funcionario/info_funcionario/:id", (req, res) => {
    novoFuncionario = {
        first_name: "Pessoa",
        last_name: "da Terra",
        user_name: "pessoadaterra",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("funcionario/info_funcionario", {funcionario: novoFuncionario})
})

app.get("/funcionario/edit_funcionario/:id", (req, res) => {
    novoFuncionario = {
        first_name: "Pessoa",
        last_name: "da Terra",
        user_name: "pessoadaterra",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("funcionario/edit_funcionario", {funcionario: novoFuncionario})
})

app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})


