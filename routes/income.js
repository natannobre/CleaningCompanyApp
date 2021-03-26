const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/income")
const Income = mongoose.model("income")

function mascaraData(data) {
    dia = data.getDate()+1;
    mes = data.getMonth()+1;
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

router.get("/add", (req, res) => {
    res.render("income/add_income")
})

router.post("/add", (req, res) => {
    
    var erros = [];

    if(!req.body.value || typeof req.body.value ==undefined || req.body.value ==null){
        erros.push({texto: "Valor inválido!"})    
    }

    if(!req.body.type || typeof req.body.type  ==undefined || req.body.type  ==null){
        erros.push({texto: "Tipo inválido"})
    }    

    if(!req.body.description || typeof req.body.description ==undefined || req.body.description ==null){
        erros.push({texto: "Descrição inválido"})
    }    

    if(erros.length > 0){
        req.flash("error_msg", "Erros nos parâmetros!");
        res.render("income/add_income")        
    }else{
        now = new Date()
        console.log("cadastrado na data: "+now)
        const newIncome = new Income({
            value: req.body.value,
            type: req.body.type,
            date: now,
            description: req.body.description
        })

        newIncome.save().then(() => {
            req.flash("success_msg", "Receita registrada!");
            res.redirect("/income/add");
        }).catch((err)=>{
            console.log(err);
            req.flash("error_msg", "Não registrado!");
            res.redirect("/income/add");
        })
                
    }
})

module.exports = router;