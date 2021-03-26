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
const income = require("./routes/income");
const cash_desk = require("./routes/cash_desk");
const contract = require("./routes/contract");


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
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
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
app.use("/income",  income);
app.use("/cash_desk", cash_desk);
app.use("/contract", contract);


app.get("/contrato/busca_contrato", (req, res) => {
    res.render("contract/recovery_contract");
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
    res.render("contract/recovery_contract", { contratos: contratos });

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
    res.render("contract/description_contract", { contrato: contrato });
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
    res.render("contract/edit_contract", { contrato: contrato });
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
    //res.locals.usuario = false;
    //req.flash("success_msg", "Deslogado do sistema")
    res.redirect("/");
})


app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})



