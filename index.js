const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');
const client= require("./routes/client")
const employee= require("./routes/employee")

//Configuração do body-parser
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json())

//Configuração do handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//Mongose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/cleaningSquadApp").then(()=>{
    console.log("Conectado ao mongo")
}).catch((err)=>{
    console.log("Erro ao se conectar" + err) 
})

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

app.use("/client", client)
app.use("/employee", employee)
app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})

