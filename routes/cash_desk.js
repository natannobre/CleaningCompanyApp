const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/income")
const Income = mongoose.model("income")

router.get("/dailyList", (req, res) => {
    
    incomes = [];  
    Income.find({date: Date.parse(req.query.date)}).lean().then((income)=> {
        incomes.push(income)
    }).catch((err)=> {
        req.flash("error_msg", "Não encontrou correspondência a essa data!")
    })
    credito_t = 0
    debito_t = 0
    total = 0

    for (const inc of incomes) {
        if(inc.type == "Crédito") {
            credito_t += inc.value
        } else if (inc.type == "Débito") {
            debito_t += inc.value
        }
    }
    var dateObj = new Date();

    hoje = ""+dateObj.getUTCFullYear()+"-"+dateObj.getUTCMonth() + 1+"-"+dateObj.getUTCDate();
    res.render("cash_desk/daily_cashier", 
    {
        data: req.query.date, 
        data2: hoje,
        incomes: incomes,
        credito_total: credito_t.toString(),
        debito_total: debito_t.toString(),
        saldo_total: (credito_t-debito_t).toString(),
    });
})

router.get("/search", (req, res) => {
    res.render("cash_desk/search_cashier");
})

router.get("/list", (req, res) => {
    
    // var dateAux = Date.parse(req.query.initialDate);
    // while(dateAux <= Date.parse(req.query.finalDate)) {
    //     dateAux.setDate(dateAux.getDate() + 1);
    // }
    // tomorrow.setDate(tomorrow.getDate() + 1);
    
    var cashier = [];
    var cash1 = {
        date: "25/03/2021",
        credit: "200,00",
        debit: "50,00",
        profit: "150,00"
    }
    var cash2 = {
        date: "25/03/2021",
        credit: "500,00",
        debit: "150,00",
        profit: "350,00"
    }
    cashier.push(cash1);
    cashier.push(cash2);
    res.render("cash_desk/search_cashier", 
    {
     cashier: cashier,
     credito_total: "700,00",
     debito_total: "200,00",
     saldo_total: "500,00",
    });
})

module.exports = router;