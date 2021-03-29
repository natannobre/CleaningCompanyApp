const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/income")
const Income = mongoose.model("income")
const {isLogged} = require("../config/isLogged")
const mascaraData = require("../utils/mascaraData").mascaraData;
const mascaraDataBanco = require("../utils/mascaraData").mascaraDataBanco;
const mascaraDePreco = require("../utils/mascaraPreco").mascaraDePreco;


router.get("/dailyList", isLogged, (req, res) => {

    var dataAux = (req.query.date) ? new Date(req.query.date) : new Date();
    var val = (req.query.date) ? 1 : 0;

    incomesOfDate = [];

    Income.find().lean().then((incomes) => {
        if (incomes) {
            var credito_t = 0
            var debito_t = 0

            for (const inc of incomes) {
                const data1 = mascaraDataBanco(inc.date);
                const data2 = mascaraData(dataAux, val);

                //console.log(data1+"--"+data2);//comparando as datas

                if (data1 == data2) {


                    if (inc.type == "1") {
                        credito_t += inc.value;
                        inc.type = true;
                    } else if (inc.type == "0") {
                        debito_t += inc.value;
                        inc.type = false;
                    }
                    inc.value = mascaraDePreco(inc.value);
                    incomesOfDate.push(inc)

                }

            }
            var partesDateToday = dataAux.toISOString().split("T");
            var dateToday = partesDateToday[0];

            res.render("cash_desk/daily_cashier",
                {
                    data: mascaraData(dataAux, val),
                    data2: dateToday,
                    incomes: incomesOfDate,
                    credito_total: mascaraDePreco(credito_t),
                    debito_total: mascaraDePreco(debito_t),
                    saldo_total: mascaraDePreco((credito_t - debito_t)),
                });
        } else {
            req.flash("error_msg", "Caixa não encontrado!");
            res.redirect("/home");
        }
    }).catch((err) => {
        req.flash("error_msg", "Não encontrou correspondência a essa data!")
        console.log(err);

    })
})

router.get("/search", isLogged, (req, res) => {
    res.render("cash_desk/search_cashier");
})

router.get("/list", (req, res) => {

    var dataAux1 = new Date(req.query.initialDate)
    var dataAux2 = new Date(req.query.finalDate)

    incomesSearching = [];

    Income.find().lean().then((incomes) => {
        if (incomes) {
            var credito_t = 0
            var debito_t = 0
            var initialDate;
            var finalDate;
            for (const inc of incomes) {

                const dataBanco = mascaraDataBanco(inc.date)

                if ((inc.date >= dataAux1) && (inc.date <= dataAux2)) {


                    if (inc.type == "1") {
                        credito_t += inc.value
                        inc.type = true;
                    } else if (inc.type == "0") {
                        debito_t += inc.value
                        inc.type = false;
                    }

                    inc.value = mascaraDePreco(inc.value);
                    inc.date = dataBanco;
                    incomesSearching.push(inc)

                }
            }
            if (incomesSearching.length > 0) {
                initialDate = mascaraData(dataAux1, 1);
                finalDate = mascaraData(dataAux2, 1);
                res.render("cash_desk/search_cashier",
                    {
                        incomes: incomesSearching,
                        credito_total: mascaraDePreco(credito_t),
                        debito_total: mascaraDePreco(debito_t),
                        saldo_total: mascaraDePreco((credito_t - debito_t)),
                        initialDate: initialDate,
                        finalDate: finalDate
                    });
            } else {
                res.render("cash_desk/search_cashier",
                    {
                        noIncomes: true,
                        credito_total: mascaraDePreco(credito_t),
                        debito_total: mascaraDePreco(debito_t),
                        saldo_total: mascaraDePreco((credito_t - debito_t)),
                    });
            }

        } else {
            req.flash("error_msg", "Caixa não encontrado!");
            res.redirect("/home");
        }
    }).catch((err) => {
        req.flash("error_msg", "Não encontrou correspondência a essa data!")
        console.log(err);

    })


})

module.exports = router;