const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/contract")
const Contract = mongoose.model("contract")
require("../models/cleaning")
const Cleaning = mongoose.model("cleaning")
require("../models/employee")
const Employee = mongoose.model("employee")
require("../models/client")
const Client = mongoose.model("client")
const { isLogged } = require("../config/isLogged")
const mascaraData = require("../utils/mascaraData").mascaraData;
const mascaraDataBanco = require("../utils/mascaraData").mascaraDataBanco;

router.get("/dailyCleaning", isLogged, (req, res) => {

    var dataBuscada = (req.query.date) ? new Date(req.query.date) : new Date();
    var val = (req.query.date) ? 1 : 0;
    cleaningsSearching = [];

    var [dateFormatedSearching,] = dataBuscada.toISOString().split("T");

    Cleaning.find().lean()
        .populate("contract")
        .populate("client")
        .populate("employee")
        .then((cleanings) => {
            if (cleanings) {
                for (const cleaning of cleanings) {
                    const data1 = mascaraDataBanco(cleaning.date);
                    const data2 = mascaraData(dataBuscada, val);
                    if (data1 == data2) {
                        cleaningsSearching.push(cleaning);
                    }
                }
                res.render("cleaning/dailyCleaning",
                    {
                        cleanings: cleaningsSearching,
                        dateSearching: mascaraData(dataBuscada, val),
                        dateFormatedSearching: dateFormatedSearching
                    })
            }
        }).catch((err) => {
            console.log(err);
        })

})

router.get("/recovery", isLogged, (req, res) => {
    res.render("cleaning/recovery_cleaning");
})
// employee
router.get("/recovery/search", isLogged, (req, res) => {

    if (req.query.type == "client") {
        if (req.query.name.search(" ") < 0) {
            req.flash("error_msg", "Limpeza não encontrada 1!")
            res.redirect("/cleaning/recovery");
        }
        var [first_name, last_name] = req.query.name.split(" ");

        Client.findOne({ first_name: first_name, last_name: last_name }).lean().then((client) => {
            if (client) {
                Cleaning.find({ client: client._id }).sort({ date: "asc" }).lean().populate("client").populate("employee").populate("contract").then((cleanings) => {
                    if (cleanings) {
                        for (var i = 0; i < cleanings.length; i++) {
                            cleanings[i].date = mascaraDataBanco(cleanings[i].date);
                        }
                        res.render("cleaning/recovery_cleaning", { cleanings: cleanings });
                    } else {
                        req.flash("error_msg", "Limpeza não encontrada 2!")
                        res.redirect("/cleaning/recovery");
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                req.flash("error_msg", "Limpeza não encontrada 3!")
                res.redirect("/cleaning/recovery");
            }
        }).catch((err) => {
            console.log(err);
        })
    } else if (req.query.type == "employee") {
        if (req.query.name.search(" ") < 0) {
            req.flash("error_msg", "Limpeza não encontrada!")
            res.redirect("/cleaning/recovery");
        }
        var [first_name, last_name] = req.query.name.split(" ");

        Employee.findOne({ first_name: first_name, last_name: last_name }).then((employee) => {
            if (employee) {
                Cleaning.find({ employee: employee._id }).sort({ date: "asc" }).lean().populate("client").populate("employee").populate("contract").then((cleanings) => {
                    if (cleanings) {
                        for (var i = 0; i < cleanings.length; i++) {
                            cleanings[i].date = mascaraDataBanco(cleanings[i].date);
                        }
                        res.render("cleaning/recovery_cleaning", { cleanings: cleanings });
                    } else {
                        req.flash("error_msg", "Limpeza não encontrado!")
                        res.redirect("/cleaning/recovery");
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                req.flash("error_msg", "Limpeza não encontrada!")
                res.redirect("/cleaning/recovery");
            }
        }).catch((err) => {
            console.log(err);
        })

    }

})


router.get("/list", isLogged, (req, res) => {

    Cleaning.find().sort({ date: "asc" }).lean().populate("client").populate("employee").populate("contract").then((cleanings) => {
        if (cleanings) {
            for (var i = 0; i < cleanings.length; i++) {
                cleanings[i].date = mascaraDataBanco(cleanings[i].date);
            }
            res.render("cleaning/recovery_cleaning", { cleanings: cleanings });
        }

    }).catch((err) => {
        req.flash("error_msg", "Não pode listar!")
        res.redirect("/home")
    })

})


router.get("/description/:id", isLogged, (req, res) => {
    Cleaning.findOne({ _id: req.params.id }).lean().populate("client").populate("contract").populate("employee").then((cleaning) => {
        if (cleaning) {
            cleaning.date = mascaraDataBanco(cleaning.date)
            res.render("cleaning/description_cleaning", { cleaning: cleaning })
        } else {
            req.flash("error_msg", "Limpeza não encontrada!");
            res.redirect("/home");
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.post("/reschedule", isLogged, (req, res) => {

    var dataAux = new Date(req.body.date);
    Cleaning.findOne({ _id: req.body.id }).lean().populate("contract").then((cleaning) => {

        var dateExpiration = new Date(cleaning.contract.expiration);

        if (dataAux > dateExpiration) {
            req.flash("error_msg", "Limpeza não remarcada, data fora do contrato");
            res.redirect("/cleaning/dailyCleaning");
        } else {
            Cleaning.updateOne({ _id: req.body.id }, {
                $set: {
                    date: dataAux
                }
            }).lean().then(() => {
                Contract.updateOne({ _id: cleaning.contract._id }, {
                    $set:
                        { nextCleaning: dataAux }
                }
                ).lean().then(() => {

                    req.flash("success_msg", "Limpeza remarcada!");
                    res.redirect("/cleaning/recovery");

                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Limpeza não remarcada!!");
                    res.redirect("/cleaning/recovery");
                })
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg", "Limpeza não remarcada!!");
                res.redirect("/cleaning/recovery");
            })
        }



    }).catch((err) => {
        console.log(err);
        req.flash("error_msg", "Limpeza não remarcada!!");
        res.redirect("/cleaning/recovery");
    })


})

router.post("/update", isLogged, (req, res) => {
    Cleaning.findOne({ _id: req.body.id }).lean().populate("contract").then((cleaning) => {
        if (cleaning) {
            var date = new Date(cleaning.date);
            var proximoDia = date.getDate();

            if (cleaning.contract.contract_type == "Semanal") {
                proximoDia = proximoDia + 7
            } else if (cleaning.contract.contract_type == "Quinzenal") {
                proximoDia = proximoDia + 15
            } else if (cleaning.contract.contract_type == "Mensal") {
                proximoDia = proximoDia + 30
            }
            date.setDate(proximoDia);
            var dateExpiration = new Date(cleaning.contract.expiration);

            if (date > dateExpiration) {
                Cleaning.updateOne({ _id: req.body.id }, {
                    $set:
                        { status: true }
                }
                ).lean().then(() => {
                    req.flash("success_msg", "Limpeza concluída e nova limpeza não marcada, contrato expirando");
                    res.redirect("/cleaning/dailyCleaning");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Erro ao concluir a limpeza");
                    res.redirect("/cleaning/dailyCleaning");
                })

            } else {
                const newCleaning = new Cleaning({
                    date: date,
                    employee: mongoose.Types.ObjectId(cleaning.contract.employee),
                    contract: mongoose.Types.ObjectId(cleaning.contract._id),
                    client: mongoose.Types.ObjectId(cleaning.contract.client)
                })

                newCleaning.save().then(() => {

                    Cleaning.updateOne({ _id: req.body.id }, {
                        $set:
                            { status: true }
                    }
                    ).lean().then(() => {

                        Contract.updateOne({ _id: cleaning.contract._id }, {
                            $set:
                                { nextCleaning: date }
                        }
                        ).lean().then(() => {

                            req.flash("success_msg", "Limpeza concluída!");
                            res.redirect("/cleaning/dailyCleaning");

                        }).catch((err) => {
                            console.log(err);
                            req.flash("error_msg", "Não concluído 222!");
                            res.redirect("/cleaning/dailyCleaning");
                        })

                    }).catch((err) => {
                        console.log(err);
                        req.flash("error_msg", "Não concluído!");
                        res.redirect("/cleaning/dailyCleaning");
                    })

                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Não concluído!");
                    res.redirect("/cleaning/dailyCleaning");
                })
            }


        } else {
            req.flash("error_msg", "Não concluído!");
            res.redirect("/cleaning/dailyCleaning");
        }
    }).catch((err) => {
        console.log(err);
    })

})

module.exports = router;