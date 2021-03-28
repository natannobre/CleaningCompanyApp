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
require("./config/auth")(passport)
require("./models/user")
const User = mongoose.model("user")
const bcrypt = require("bcryptjs")


const client = require("./routes/client");
const employee = require("./routes/employee");
const income = require("./routes/income");
const cash_desk = require("./routes/cash_desk");
const contract = require("./routes/contract");

const {isLogged} = require("./config/isLogged")

const userEmailAdmin = "admin@admin.com";

require("./models/client")
const Client = mongoose.model("client");
require("./models/contract")
const Contract = mongoose.model("contract")
require("./models/contract")
const Employee = mongoose.model("employee")

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

// const novoClient = new Client({
//     email: "teste@teste.com",
//     first_name: "Teste",
//     last_name: "Teste",
//     ssn: "123456789",
//     phone: "123456789"
// })

// novoClient.save().then(() => {
//     console.log("Cliente teste registrado");
// }).catch((err)=>{
//     console.log(err)
// })

// const newEmployee = new Employee({
//     user_name: "funcionario1",
//     password: "funcionario1",
//     first_name: "funcionario1",
//     last_name: "funcionario1",
//     ssn: "funcionario1",
//     phone: "funcionario1"
// })

// newEmployee.save().then(() => {
//     console.log("Funcionario cadastrado");
// }).catch((err)=>{
//     console.log(err);
// })

// const newAdress = {
//     zipcode: "1",
//     street: "1",
//     number: 1,
//     neighborhood: "1",
//     state: "1",
//     city: "1"
// }


// const newContract = new Contract({
//     client: mongoose.Types.ObjectId("606094a15d76161e6444f005"),
//     employee: mongoose.Types.ObjectId("606094f499c0ac1eafc3cf40"),
//     contract_price: 4,
//     contract_type: "1",
//     expiration: new Date(),
//     status: true,
//     address: newAdress,
// })

// newContract.save().then(() => {
//     console.log("Contrato Cadastrado");
// }).catch((err) => {
//     console.log(err);
// })

// Contract.find().lean().populate("client").populate("employee").then((contracts) => {
//     console.log(contracts);
// }).catch((err) => {
//     console.log(err);
// })

app.use((req, res, next) => {
    res.locals.usuario = req.user || null;
    res.locals.error = req.flash("error")
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})

//Rotas utilizadas 
    app.use("/client", client);
    app.use("/employee", employee);
    app.use("/income",  income);
    app.use("/cash_desk", cash_desk);
    app.use("/contract", contract);

//Rotas
    app.get("/", (req, res) => {
        res.redirect("/login");
    })

    app.get("/login", (req, res)=>{
        User.find().lean().then((user)=> {
            if(user.length>0){                
                res.render("login");    
            }else{
                const newUser = new User({
                    email: "admin@admin.com",
                    first_name: "Administrador",
                    user_name: "Administrador",
                    password: "admin",
                    last_name: "Administrador",
                    ssn: "Adiministrador",
                    phone: "(88) 888888888"
                })
    
                bcrypt.genSalt(10, (erro, salt)=> {
                    bcrypt.hash(newUser.password, salt, (erro, passwordHash)=>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        newUser.password = passwordHash
    
                        newUser.save().then(() => {                            
                            res.render("login")
                        }).catch((err)=>{
                            console.log(err);
                            res.render("login");
                        })
                    })
                })         
            }
        }).catch((err)=> {
            console.log("erro -->", err)
            res.render("login")
        })
        
    })

    app.post("/login",( req, res, next)=> {
        
        passport.authenticate("local", {
            successRedirect: "/home",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next)
    })
    app.post("/updateUser", isLogged, (req, res) =>{
        User.find().lean().then((user1)=> {
            if(user1) {
                bcrypt.genSalt(10, (erro, salt)=> {
                    bcrypt.hash(req.body.password, salt, (erro, passwordHash)=>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        var newPassword = passwordHash
                        User.updateOne({email: user1[0].email},{$set: 
                            {email: req.body.email, 
                            user_name: req.body.user_name,
                            first_name: req.body.first_name, 
                            last_name: req.body.last_name,
                            password: newPassword,
                            ssn: req.body.ssn,
                            phone: req.body.phone,}}
                            ).lean().then((user)=> {
                                req.flash("success_msg", "Administrador Atualizado");                        
                                res.redirect("/logout");
                            }).catch((err)=> {
                                req.flash("error_msg", "can't update");
                                console.log("esse erro: "+err)
                                res.redirect("/perfil");
                            })
                        
                    })
                }) 
                
            }            
        }).catch((err)=> {
            console.log("erro -->", err)
            res.render("login")
        })
    })    

    app.get("/home", isLogged, (req, res) => {
        res.render("home");
    })

    app.get('/logout', (req, res) => {
        req.logOut();
        // res.locals.usuario = false;
        req.flash("success_msg", "Deslogado do sistema")
        res.redirect("/");
    })

    app.get("/perfil", (req, res) => {
        res.render("perfil");
    })

const port = 8888;
const host = "localhost"

app.listen(port, host, () => {
    console.log("Servidor executando na porta " + port);
})



