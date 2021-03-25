const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

router.get("/dailyList", (req, res) => {
    var incomes = [];
    var income1 = {
        value: "200,00",
        type: true,
        description: "Valor de contrato recebido"
    }
    var income2 = {
        value: "50,00",
        type: false,
        description: "Compra de Equipamentos"
    }
    incomes.push(income1);
    incomes.push(income2);
    res.render("cash_desk/daily_cashier", 
    {data: "25/03/2021", data2: "2021-03-25",
     incomes: incomes,
     credito_total: "200,00",
     debito_total: "50,00",
     saldo_total: "150,00",
    });
})

router.get("/search", (req, res) => {
    res.render("cash_desk/search_cashier");
})

router.get("/list", (req, res) => {
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