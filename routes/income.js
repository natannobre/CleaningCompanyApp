const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/income")
const Income = mongoose.model("income")

router.get("/add", (req, res) => {
    console.log(req.body.type)
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
        res.render("income/add_income", {erros: erros})
    }else{
        now = new Date()
        const newIncome = new Income({
            value: Float.parseFloat(req.body.value),
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