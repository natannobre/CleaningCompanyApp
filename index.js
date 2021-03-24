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
    res.locals.usuario = {
        user_name: "natannobre",
        first_name: "Natan",
        last_name: "Nobre",
        ssn: "11111111",
        phone: "(88) 99999-9999"
    }
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


app.get("/cliente/add_cliente", (req, res) => {
    res.render("cliente/add_cliente");
})

app.get("/cliente/busca_cliente", (req, res) => {
    res.render("cliente/busca_cliente");
})

app.get("/cliente/busca_cliente/:busca", (req, res) => {
    clientes = [];
    novoCliente = {
        first_name: "Pessoa",
        last_name: "da Terra",
        email: "pessoadaterra@gmail.com",
        phone: "(88) 99999-9999",
        SSN: "123456789"
    }
    clientes.push(novoCliente)
    res.render("cliente/busca_cliente", {clientes: clientes});
})

app.get("/cliente/info_cliente/:id", (req, res) => {
    novoCliente = {
        first_name: "Pessoa",
        last_name: "da Terra",
        email: "pessoadaterra@gmail.com",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("cliente/info_cliente", {cliente: novoCliente})
})

app.get("/cliente/edit_cliente/:id", (req, res) => {
    novoCliente = {
        first_name: "Pessoa",
        last_name: "da Terra",
        email: "pessoadaterra@gmail.com",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("cliente/edit_cliente", {cliente: novoCliente})
})


app.get("/contrato/add_contrato", (req, res) => {
    var clientes = [];
    var cliente1 = {
        _id: 1,
        first_name: "Natan",
        last_name: "Nobre"
    }
    var cliente2 = {
        _id: 2,
        first_name: "Ruan",
        last_name: "Felipe"
    }
    clientes.push(cliente1);
    clientes.push(cliente2);
    res.render("contrato/add_contrato", {clientes: clientes});
})

app.get("/contrato/busca_contrato", (req, res) => {
    res.render("contrato/busca_contrato");
})

app.get("/contrato/busca_contrato/:busca", (req, res) => {
    var contratos = [];
    var novoContrato = {
        client: "Pessoa da Terra",
        price: "R$ 1000,00",
        type: "semanal",
        phone: "(88) 99999-9999",
        expiration: "2 anos",
        address: {
            street: "Rua da Estrada",
            neighborhood: "Bairro da Cidade",
            number: 12,
            zipcode: "12345-678",
            city: "New York",
            state: "New York"
        }
    }
    contratos.push(novoContrato);
    res.render("contrato/busca_contrato", {contratos: contratos});

})

app.get("/contrato/info_contrato/:id", (req, res) => {
    var contrato = {
        client: "Pessoa da Terra",
        price: "R$ 1000,00",
        type: "semanal",
        phone: "(88) 99999-9999",
        expiration: "2 anos",
        address: {
            street: "Rua da Estrada",
            neighborhood: "Bairro da Cidade",
            number: 12,
            zipcode: "12345-678",
            city: "New York",
            state: "New York"
        }
    }
    res.render("contrato/info_contrato", {contrato: contrato});
})

app.get("/contrato/edit_contrato/:id", (req, res) => {
    var contrato = {
        client: "Pessoa da Terra",
        price: "R$ 1000,00",
        type: "semanal",
        phone: "(88) 99999-9999",
        expiration: "2 anos",
        address: {
            street: "Rua da Estrada",
            neighborhood: "Bairro da Cidade",
            number: 12,
            zipcode: "12345-678",
            city: "New York",
            state: "New York"
        }
    }
    res.render("contrato/edit_contrato", {contrato: contrato});
})

app.get("/receita/add_receita", (req, res) => {
    res.render("receita/add_receita");
})

app.get("/perfil", (req, res) => {
    res.render("perfil");
})

app.get('/logout', (req, res) => {
    //req.logOut();
    res.locals.usuario = false;
    //req.flash("success_msg", "Deslogado do sistema")
    res.redirect("/")
})


app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})



