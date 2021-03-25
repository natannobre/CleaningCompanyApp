const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
require("../models/client")
const Client = mongoose.model("client");

router.get("/add", (req, res) => {
    res.render("client/add_client");
})

router.post("/add", (req, res) => {
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
                    req.flash("success_msg", "Registered");
                    res.redirect("/home");
                }).catch((err)=>{
                    req.flash("error_msg", "no registered");
                    res.redirect("/home");
                })
            }
        }).catch((err)=> {
            res.redirect("/home");
        })

    }
})

router.get("/recovery", (req, res) => {
    res.render("client/recovery_client");
})

router.get("/recovery/search", (req, res) => { 
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

router.get("/description/:id", (req, res) =>{
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

router.get("/edit/:id", (req, res) =>{
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

router.get("/list", (req, res) => {
    clients = [];  
    Client.find().lean().then((client)=> {
        clients.push(client)
    }).catch((err)=> {
        req.flash("error_msg", "can't list")
    })
    res.render("client/list", {clients: clients});
})

router.post("/delete", (req, res) => {
    Client.deleteOne({id: req.params.id}).lean().then((client)=> {
        req.flash("success_msg", "deleted");
        res.redirect("/client/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "can't delete");
        res.redirect("/client/recovery");
    })
})

router.post("/update", (req, res) =>{
    Client.replaceOne({_id: req.body.id}, 
    {email: req.body.email, 
    first_name: req.body.first_name, 
    last_name: req.body.last_name,
    ssn: req.body.ssn,
    phone: req.body.phone}
    ).lean().then((client)=> {
        req.flash("success_msg", "updated");
        res.redirect("/client/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "can't update");
        res.redirect("/client/recovery");
    })
})


module.exports = router
