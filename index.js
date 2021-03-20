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

app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})


