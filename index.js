const express = require('express');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const app = express();
const router = express.Router();
const path = require('path');

const mongoose = require("mongoose");
const db = require("./config/db");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const client = require("./routes/client");
const employee = require("./routes/employee");



function mascaraData(data) {
    dia = data.getDate();
    mes = data.getMonth() + 1;
    ano = data.getFullYear();
    data = dia + "-" + mes + "-" + ano;
    partesData = data.split("-")
    var novaData

    if (partesData[0].length == 1) {
        novaData = "0" + partesData[0]
    } else {
        novaData = partesData[0]
    }

    novaData = novaData + "/"

    if (partesData[1].length == 1) {
        novaData = novaData + "0" + partesData[1]
    } else {
        novaData = novaData + partesData[1]
    }

    novaData = novaData + "/" + partesData[2]
    return novaData
}

//Configuração do body-parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())

//Configuração do handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

//Public
app.use(express.static(path.join(__dirname, "public")))

//Flash e Session
app.use(session({
    secret: "cleaningcompanyapp",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Mongose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar" + err)
})

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

app.use("/client", client);
app.use("/employee", employee);


app.get("/funcionario/busca_funcionario", (req, res) => {
    res.render("funcionario/busca_funcionario");
})



app.get("/funcionario/info_funcionario/:id", (req, res) => {
    novoFuncionario = {
        first_name: "Pessoa",
        last_name: "da Terra",
        user_name: "pessoadaterra",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("funcionario/info_funcionario", { funcionario: novoFuncionario })
})

app.get("/funcionario/edit_funcionario/:id", (req, res) => {
    novoFuncionario = {
        first_name: "Pessoa",
        last_name: "da Terra",
        user_name: "pessoadaterra",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("funcionario/edit_funcionario", { funcionario: novoFuncionario })
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
    res.render("cliente/busca_cliente", { clientes: clientes });
})

app.get("/cliente/info_cliente/:id", (req, res) => {
    novoCliente = {
        first_name: "Pessoa",
        last_name: "da Terra",
        email: "pessoadaterra@gmail.com",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("cliente/info_cliente", { cliente: novoCliente })
})

app.get("/cliente/edit_cliente/:id", (req, res) => {
    novoCliente = {
        first_name: "Pessoa",
        last_name: "da Terra",
        email: "pessoadaterra@gmail.com",
        phone: "(88) 99999-9999",
        ssn: "123456789"
    }
    res.render("cliente/edit_cliente", { cliente: novoCliente })
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
    res.render("contrato/add_contrato", { clientes: clientes });
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
    res.render("contrato/busca_contrato", { contratos: contratos });

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
    res.render("contrato/info_contrato", { contrato: contrato });
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
    res.render("contrato/edit_contrato", { contrato: contrato });
})

app.get("/receita/add_receita", (req, res) => {
    res.render("receita/add_receita");
})

app.get("/perfil", (req, res) => {
    res.render("perfil");
})

app.get("/limpeza/limpeza_do_dia", (req, res) => {
    var data = new Date();
    var dataHoje = mascaraData(data);
    var limpeza = {
        contract_id: 1,
        client_id: 2,
        date: "24/03/2021",
        status: "Não realizada"
    }

    res.render("limpeza/limpeza_do_dia", { data: dataHoje, limpeza: limpeza })
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



