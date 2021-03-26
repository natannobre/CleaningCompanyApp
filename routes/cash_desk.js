const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/income")
const Income = mongoose.model("income")

function mascaraDePreco(preco) {
    stringPreco = preco.toString().replace('.', ',')
    var i = stringPreco.indexOf(",")
    tamanho = stringPreco.length
    var substringPreco
    if (i == -1) {
        stringPreco = stringPreco.concat(",00")
    } else {
        substringPreco = stringPreco.substr(i + 1, tamanho)
        if (substringPreco.length < 2) {
            stringPreco = stringPreco.concat("0")
        }
    }
    return stringPreco
}

function mascaraDataBanco(data){
    var dataAux = data.toISOString().split("T");
    var partesData = dataAux[0].split("-");
    var novaData;

    if (partesData[2].length == 1) {
        novaData = "0" + partesData[2]
    } else {
        novaData = partesData[2]
    }

    novaData = novaData + "/"

    if (partesData[1].length == 1) {
        novaData = novaData + "0" + partesData[1]
    } else {
        novaData = novaData + partesData[1]
    }

    novaData = novaData + "/" + partesData[0]
    return novaData;
}

//soma 1 quando vem pelo req.query e 0 quando pega do banco
function mascaraData(data, val) {
    dia = data.getDate()+val;
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


router.get("/dailyList", (req, res) => {
    
    var dataAux = (req.query.date) ? new Date(req.query.date) : new Date();
    var val = (req.query.date) ? 1 : 0;

    incomesOfDate = [];  

    Income.find().lean().then((incomes)=> {
        if(incomes) {                     
            var credito_t = 0
            var debito_t = 0
            
            for (const inc of incomes) {
                const data1 = mascaraDataBanco(inc.date);
                const data2 = mascaraData(dataAux, val);
                
                console.log(data1+"--"+data2);//comparando as datas
                
                if(data1 == data2) {
                    
                    
                    if(inc.type == "1") {
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
            console.log(dateToday);
            res.render("cash_desk/daily_cashier", 
            {
                data: mascaraData(dataAux,val), 
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
    }).catch((err)=> {
        req.flash("error_msg", "Não encontrou correspondência a essa data!")
        console.log(err);
        
    })    
})

router.get("/search", (req, res) => {
    res.render("cash_desk/search_cashier");
})

router.get("/list", (req, res) => {

    var dataAux1 = new Date(req.query.initialDate)
    var dataAux2 = new Date(req.query.finalDate)
 
    var cashier = [];

    Income.find().lean().then((incomes)=> {
        if(incomes) {                     
            var credito_t = 0
            var debito_t = 0
            
            for (const inc of incomes) {
                const dataBanco = mascaraData(inc.date, 0)
                const dataInicial = mascaraData(dataAux1, 1)
                const dataFinal = mascaraData(dataAux2, 1)
                // console.log(data1+"--"+data2);//comparando as datas
                
                if((dataBanco >=dataInicial) && (dataBanco <=dataFinal)) {
                    
                    cashier.push(inc)
                    
                    if(inc.type == "1") {
                        credito_t += inc.value
                    } else if (inc.type == "0") {
                        debito_t += inc.value
                    }
                }
            
            }
            res.render("cash_desk/search_cashier", 
            {
            cashier: cashier,
            credito_total: credito_t,
            debito_total: debito_t,
            saldo_total: (credito_t-debito_t),
            });
        } else {
            req.flash("error_msg", "Caixa não encontrado!");
            res.redirect("/home");
        }
    }).catch((err)=> {
        req.flash("error_msg", "Não encontrou correspondência a essa data!")
        console.log(err);
        
    })        
    
    
})

module.exports = router;