const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/employee")
const Employee = mongoose.model("employee")

router.post("/add", (req, res) =>{
    var erros = []

    if(!req.body.user_name || typeof req.body.user_name ==undefined || req.body.user_name ==null){
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
        res.render("employee/add", {erros: erros})
    }else{
        Employee.findOne({ssn: req.body.ssn}).then((employee)=> {

            if(employee){
                req.flash("error_msg", "ssn_exist")
            }else{
                const newEmployee = new Employee({
                    user_name: req.body.user_name,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    ssn: req.body.ssn,
                    phone: req.body.phone
                })

                newEmployee.save().then(() => {
                    req.flash("success_msg", "registered")
                }).catch((err)=>{
                    req.flash("error_msg", "no registered")
                })
            }
        }).catch((err)=> {
            res.redirect("/")
        })

    }
})

router.get("/add", (req, res) => {
    res.render("employee/add");
})

router.get("/recovery", (req, res) => {
    res.render("employee/recovery");
})

router.get("/recovery/:user_name", (req, res) => {
    employees = [];   
    Employee.find({user_name: req.params.user_name}).lean().then((employee) => {
        if(employee){
            employees.push(employee)
        }else{
            req.flash("error_msg", "no find employee")
        }
    }). catch((err)=> {
        console.log(err)
    })
    
    res.render("employee/recovery", {employees: employees});
})

router.get("/description/:id", (req, res) => {
    Employee.findOne({first_name: req.params.id}).lean().then((employee) => {
        if(employee){
            res.render("employee/description", {employee: employee})
        }else{
            req.flash("error_msg", "no find employee")
        }
    }). catch((err)=> {
        console.log(err)
    })    
})

router.post("/update/:id", (req, res) => {
    Employee.replaceOne({id: req.body.id}, {user_name: req.body.user_name, password: req.body.password, first_name: req.body.first_name, last_name: req.body.last_name,ssn: req.body.ssn, phone: req.body.phone}
    ).lean().then((employee)=> {
        res.render("employee/description", {employee: employee})
    }).catch((err)=> {
        req.flash("error_msg", "can't update")
    })    
})

module.exports = router
