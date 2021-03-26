const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/contract")
const Contract = mongoose.model("contract")

router.post("/add", (req, res) =>{
    var erros = [];

    if(!req.body.contract_price || typeof req.body.contract_price ==undefined || req.body.contract_price ==null){
        erros.push({texto: "Preço inválido"})
    }    

    if(!req.body.contract_type || typeof req.body.contract_type ==undefined || req.body.contract_type ==null){
        erros.push({texto: "Tipo de contrato inválido"})
    }    
    
    if(!req.body.validity || typeof req.body.validity ==undefined || req.body.validity ==null){
        erros.push({texto: "Validade inválida"})
    }    

    if(!req.body.status || typeof req.body.status == undefined || req.body.status ==null){
        erros.push({texto: "Status inválido"})
    }     
    
    if(!req.body.address || typeof req.body.address == undefined || req.body.address ==null){
        erros.push({texto: "Endereço inválido"})
    }     

    if(erros.length > 0){
        res.render("contract/add", {erros: erros})
    }else{
        Contract.findOne({client_name: req.body.client_name}).then((contract)=> {

            if(contract){
                req.flash("error_msg", "Cliente já possui contrato!");
                res.redirect("/contract/add");
            }else{
                const newAdress = {
                    zipcode: req.body.zipcode,
                    street: req.body.street,
                    number: req.body.number,
                    neighborhood: req.body.neighborhood,
                    state: req.body.state,
                    city: req.body.city
                }

                const newContract = new Contract({
                    client_id: req.body.client_id,
                    client_name: req.body.client_name,
                    contract_price: Float.parseFloat(req.body.contract_price),
                    contract_type: req.body.contract_type,
                    expiration: req.body.expiration,
                    status: req.body.status,
                    address: newAdress
                })

                newContract.save().then(() => {
                    req.flash("success_msg", "Contrato registrado com sucesso!");
                    res.redirect("/contract/add");
                }).catch((err)=>{
                    console.log(err);
                    req.flash("error_msg", "Contrato não registrado!");
                    res.redirect("/contract/add");
                })
            }
        }).catch((err)=> {
            res.redirect("/")
        })

    }
})

router.get("/add", (req, res) => {
    res.render("contract/add_contract");
})

router.get("/recovery", (req, res) => {
    res.render("contract/recovery_contract");
})

router.get("/recovery/search", (req, res) => { 
    Contract.find({client_name: req.query.client_name}).lean().then((contracts) => {
        if(contracts){
            res.render("contract/recovery_contract", {contracts: contracts});
        }else{
            req.flash("error_msg", "Contrato não encontrado!")
            res.redirect("/home");
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/description/:id", (req, res) => {
    Contract.findOne({client_name: req.params.client_name}).lean().then((contract) => {
        if(contract){
            res.render("contract/description_contract", {contract: contract})
        }else{
            req.flash("error_msg", "Contrato não encontrado@");
            res.redirect("/home");
        }
    }). catch((err)=> {
        console.log(err)
    })    
})

router.get("/edit/:id", (req, res) => {
    Contract.findOne({client_name: req.params.client_name}).lean().then((contract) => {
        if(contract){
            res.render("contract/edit_contract", {contract: contract})
        }else{
            req.flash("error_msg", "Contrato não encontrado!");
            res.redirect("/home");
        }
    }). catch((err)=> {
        console.log(err)
    })    
})

router.post("/update", (req, res) => {

    const newAdress = {
        zipcode: req.body.zipcode,
        street: req.body.street,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        state: req.body.state,
        city: req.body.city
    }

    Contract.replaceOne({client_name: req.body.client_name}, 
    {
        client_id: req.body.client_id,
        client_name: req.body.client_name,
        contract_price: Float.parseFloat(req.body.contract_price),
        contract_type: req.body.contract_type,
        expiration: req.body.expiration,
        status: req.body.status,
        address: newAdress
    }
    ).lean().then((contract)=> {
        req.flash("success_msg", "Contrato atualizado!");
        res.redirect("/contract/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "Falha ao atualizar contrato!");
        res.redirect("/contract/recovery");
    })    
})

router.post("/delete", (req, res) =>{
    Contract.deleteOne({client_name: req.body.client_name}).lean().then((contract)=> {
        req.flash("success_msg", "Contrato deletado!");
        res.redirect("/contract/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "Falha ao deletar!");
        res.redirect("/contract/recovery");
    })
})

module.exports = router
