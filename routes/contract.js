const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/contract")
const Contract = mongoose.model("contract")
const Client = mongoose.model("client");
const Employee = mongoose.model("employee");

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

function mascaraData(data) {
    dia = data.getDate();
    mes = data.getMonth() + 1;
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

router.post("/add", (req, res) => {
    var erros = [];

    // if(!req.body.contract_price || typeof req.body.contract_price ==undefined || req.body.contract_price ==null){
    //     erros.push({texto: "Preço inválido"})
    // }    

    // if(!req.body.contract_type || typeof req.body.contract_type ==undefined || req.body.contract_type ==null){
    //     erros.push({texto: "Tipo de contrato inválido"})
    // }    

    // if(!req.body.validity || typeof req.body.e ==undefined || req.body.validity ==null){
    //     erros.push({texto: "Validade inválida"})
    // }    



    var dataAux = new Date(req.body.expiration)
    var dataInicial = new Date(req.body.initialDate);

    if (erros.length > 0) {
        res.render("contract/add_contract", { erros: erros })
    } else {
        var cliente = req.body.client
        var partesCliente = cliente.split("-")
        var id_cliente = partesCliente[0]
        var nome_cliente = partesCliente[1] + " " + partesCliente[2];

        var funcionario = req.body.employee;
        var partesFuncionario = funcionario.split("-");


        var employee1 = {
            employee_id: partesFuncionario[0],
            employee_name: partesFuncionario[1] + " " + partesFuncionario[2]
        }

        var limpeza = {
            employee_name: employee1.employee_name,
            date: dataInicial,
            status: false
        }

        var cleanings = [];
        cleanings.push(limpeza);

        const newAdress = {
            zipcode: req.body.zipcode,
            street: req.body.street,
            number: req.body.number,
            neighborhood: req.body.neighborhood,
            state: req.body.state,
            city: req.body.city
        }
        const newContract = new Contract({
            client_id: id_cliente,
            client_name: nome_cliente,
            contract_price: req.body.contract_price,
            contract_type: req.body.contract_type,
            expiration: dataAux,
            status: true,
            address: newAdress,
            employee: employee1,
            cleanings: cleanings
        })

        newContract.save().then(() => {
            req.flash("success_msg", "Contrato registrado com sucesso!");
            res.redirect("/contract/add");
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Contrato não registrado!");
            res.redirect("/contract/add");
        })
    }
})

router.get("/add", (req, res) => {
    Client.find().lean().then((clients) => {

        Employee.find().lean().then((employees) => {
            res.render("contract/add_contract", { clients: clients, employees: employees });
        }).catch((err) => {
            req.flash("error_msg", "Não pode listar!")
            res.redirect("/home")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não pode listar!")
        res.redirect("/home")
    })
})

router.get("/recovery", (req, res) => {
    res.render("contract/recovery_contract");
})

router.get("/recovery/search", (req, res) => {
    Contract.find({ client_name: req.query.client_name }).lean().then((contracts) => {
        if (contracts) {
            for(var i = 0; i < contracts.length; i++){
                contracts[i].contract_price = mascaraDePreco(contracts[i].contract_price);
            }
            res.render("contract/recovery_contract", { contracts: contracts });
        } else {
            req.flash("error_msg", "Contrato não encontrado!")
            res.redirect("/home");
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.get("/description/:id", (req, res) => {
    Contract.findOne({ _id: req.params.id }).lean().then((contract) => {
        if (contract) {
            var auxContr = contract.expiration
            var dataProximaLimpeza = contract.cleanings.pop().date;
            // var parteDate = (auxContr.toISOString()).split("T");
            
            contract.expiration = mascaraDataBanco(auxContr)
            contract.nextCleaningDate = mascaraDataBanco(dataProximaLimpeza);
            res.render("contract/description_contract", { contract: contract })
        } else {
            req.flash("error_msg", "Contrato não encontrado!");
            res.redirect("/home");
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.get("/edit/:id", (req, res) => {
    Contract.findOne({ _id: req.params.id }).lean().then((contract) => {
        if (contract) {
            var auxContr = contract.expiration
            var parteDate = (auxContr.toISOString()).split("T")
            contract.expiration = parteDate[0]
            if (contract.contract_type == "mensal") {
                contract.mensal = true
            } else if (contract.contract_type == "semanal") {
                contract.semanal = true
            } else if (contract.contract_type == "quinzenal") {
                contract.quinzenal = true
            }

            var limpezas = contract.cleanings;
            var proximaLimpeza = limpezas[limpezas.length - 1];
            var parteDatas = (proximaLimpeza.date.toISOString()).split("T")
            contract.nextCleaningDate = parteDatas[0]

            Employee.find().lean().then((employees) => {
                for (var i = 0; i < employees.length; i++) {
                    if (employees[i]._id == contract.employee.employee_id)
                        employees[i].selected = true;
                }
                res.render("contract/edit_contract", { contract: contract, employees: employees })
            }).catch((err) => {
                console.log(err);
            })

        } else {
            req.flash("error_msg", "Contrato não encontrado!");
            res.redirect("/home");
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.post("/update", (req, res) => {
    Contract.findOne({ _id: req.body.id }).lean().then((contract) => {
        if (contract) {

            const newAdress = {
                zipcode: req.body.zipcode,
                street: req.body.street,
                number: req.body.number,
                neighborhood: req.body.neighborhood,
                state: req.body.state,
                city: req.body.city
            }
           
            var dataAux = new Date(req.body.expiration);
          
            var funcionario = req.body.employee;
            var partesFuncionario = funcionario.split("-");
            var employee = {
                employee_id: partesFuncionario[0],
                employee_name: partesFuncionario[1] + " " + partesFuncionario[2]
            }


            var limpezas = contract.cleanings;
            var proxLimpeza = limpezas.pop();
            proxLimpeza.date = new Date(req.body.nextCleaningDate);
            proxLimpeza.employee_name = employee.employee_name 
            limpezas.push(proxLimpeza);

            Contract.updateOne({ _id: req.body.id }, {
                $set:
                {
                    contract_price: req.body.contract_price,
                    contract_type: req.body.contract_type,
                    expiration: dataAux,
                    address: newAdress,
                    employee: employee,
                    cleanings: limpezas
                }
            }
            ).lean().then((contract) => {
                req.flash("success_msg", "Contrato atualizado!");
                res.redirect("/contract/recovery");
            }).catch((err) => {
                req.flash("error_msg", "Falha ao atualizar contrato!");
                console.log(err)
                res.redirect("/contract/recovery");
            })
        }
    }).catch((err) => {
        console.log(err);
    })

})

router.get("/list", (req, res) => {

    Contract.find().lean().then((contracts) => {
        if(contracts){
            for(var i = 0; i < contracts.length; i++){
                contracts[i].contract_price = mascaraDePreco(contracts[i].contract_price);
            }
            res.render("contract/recovery_contract", { contracts: contracts });
        }
       
    }).catch((err) => {
        req.flash("error_msg", "Não pode listar!")
        res.redirect("/home")
    })

})

router.post("/delete", (req, res) => {
    Contract.deleteOne({ _id: req.body.id }).lean().then((contract) => {
        req.flash("success_msg", "Contrato deletado!");
        res.redirect("/contract/recovery");
    }).catch((err) => {
        req.flash("error_msg", "Falha ao deletar!");
        res.redirect("/contract/recovery");
    })
})

module.exports = router
