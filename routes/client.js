const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/client")
const Client = mongoose.model("client")

router.post("/add", (req, res) =>{
    var erros = []

    if(!req.body.email || typeof req.body.email ==undefined || req.body.email ==null){
        erros.push({texto: "Usuário inválido"})
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
                req.flash("error_msg", "client_exist")
            }else{
                const novoClient = new Client({
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    ssn: req.body.ssn,
                    phone: req.body.phone
                })

                novoClient.save().then(() => {
                    req.flash("success_msg", "Registered")
                }).catch((err)=>{
                    req.flash("error_msg", "no registered")
                })
            }
        }).catch((err)=> {
            res.redirect("/")
        })

    }
})

router.get("/recovery/:id", (req, res) =>{
    Client.findOne({id: req.params.id}).lean().then((client) => {
        if(client){
            res.render("client/recovery", {client: client})
        }else{
            req.flash("error_msg", "no found client")
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/list", (req, res) =>{
    clients = [];  
    Client.find().lean().then((client)=> {
        clients.push(client)
    }).catch((err)=> {
        req.flash("error_msg", "can't list")
    })
    res.render("client/list", {clients: clients});
})

router.delete("/deleteOne/:id", (req, res) =>{
    Client.deleteOne({id: req.params.id}).lean().then((client)=> {
        req.flash("success_msg", "deleted")
    }).catch((err)=> {
        req.flash("error_msg", "can't delete")
    })
})

router.put("/update", (req, res) =>{
    Client.replaceOne({id: req.body.id}, {email: "Isaac@gmail.com", first_name: "silva", last_name: "jose",ssn: "123", phone: "12"}
    ).lean().then((client)=> {
        req.flash("success_msg", "updated")
    }).catch((err)=> {
        req.flash("error_msg", "can't update")
    })
})


module.exports = router
