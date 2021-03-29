const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
require("../models/client")
const Client = mongoose.model("client");
const {isLogged} = require("../config/isLogged");

router.get("/add", isLogged, (req, res) => {
    res.render("client/add_client");
})

router.post("/add", isLogged, (req, res) => {
    var erros = []

    if(!req.body.email || typeof req.body.email ==undefined || req.body.email ==null){
        erros.push({texto: "E-mail inválido"})
    }


    if(!req.body.first_name || typeof req.body.first_name ==undefined || req.body.first_name ==null){
        erros.push({texto: "Nome inválido"})
    }    

    if(!req.body.last_name || typeof req.body.last_name ==undefined || req.body.last_name ==null){
        erros.push({texto: "Último nome inválido"})
    }      
    if(!req.body.ssn || typeof req.body.ssn ==undefined || req.body.ssn ==null){
        erros.push({texto: "SSN inválido"})
    }       
    if(!req.body.phone || typeof req.body.phone ==undefined || req.body.phone ==null){
        erros.push({texto: "Phone inválido"})
    }           

    if(erros.length > 0){
        res.send("Ocorreu erro nos parametros!")
    }else{
        Client.findOne({ssn: req.body.ssn}).then((client)=> {

            if(client){
                req.flash("error_msg", "client_exist");
                res.render("client/add_client");
            }else{
                const novoClient = new Client({
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    ssn: req.body.ssn,
                    phone: req.body.phone
                })

                novoClient.save().then(() => {
                    req.flash("success_msg", "Cliente Registrado");
                    res.redirect("/client/add");
                }).catch((err)=>{
                    req.flash("error_msg", "Erro ao registrar o cliente");
                    res.redirect("/home");
                })
            }
        }).catch((err)=> {
            res.redirect("/home");
        })

    }
})

router.get("/recovery", isLogged, (req, res) => {
    res.render("client/recovery_client");
})

router.get("/recovery/search", isLogged, (req, res) => { 
    Client.find({first_name: req.query.first_name}).lean().then((clients) => {
        if(clients){
            res.render("client/recovery_client", {clients: clients});
        }else{
            req.flash("error_msg", "no find client");
            res.redirect("/client/recovery")
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/description/:id", isLogged, (req, res) =>{
    Client.findOne({_id: req.params.id}).lean().then((client) => {
        if(client){
            res.render("client/description_client", {client: client})
        }else{
            req.flash("error_msg", "no found client");
            res.redirect("/client/recovery");
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/edit/:id", isLogged, (req, res) =>{
    Client.findOne({_id: req.params.id}).lean().then((client) => {
        if(client){
            res.render("client/edit_client", {client: client})
        }else{
            req.flash("error_msg", "no found client");
            res.redirect("/client/recovery");
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/list", isLogged, (req, res) => {

    Client.find().lean().then((clients)=> {
        res.render("client/recovery_client", {clients: clients});
    }).catch((err)=> {
        req.flash("error_msg", "Não pode listar!")
        res.redirect("/home")
    })
    
})

router.post("/delete", isLogged, (req, res) => {
    Client.deleteOne({_id: req.body.id}).lean().then((client)=> {
        req.flash("success_msg", "Cliente Deletado");
        res.redirect("/client/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "can't delete");
        res.redirect("/client/recovery");
    })
})

router.post("/update", isLogged, (req, res) =>{
    Client.updateOne({_id: req.body.id},{$set: 
    {email: req.body.email, 
    first_name: req.body.first_name, 
    last_name: req.body.last_name,
    ssn: req.body.ssn,
    phone: req.body.phone}}
    ).lean().then((client)=> {
        req.flash("success_msg", "Cliente Atualizado");
        res.redirect("/client/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "can't update");
        res.redirect("/client/recovery");
    })
})


module.exports = router
