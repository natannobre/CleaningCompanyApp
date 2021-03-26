const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/employee")
const Employee = mongoose.model("employee")

router.post("/add", (req, res) =>{
    var erros = [];

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

    if(!req.body.phone || typeof req.body.phone == undefined || req.body.phone ==null){
        erros.push({texto: "Phone inválido"})
    }        

    if(erros.length > 0){
        res.render("employee/add", {erros: erros})
    }else{
        Employee.findOne({ssn: req.body.ssn}).then((employee)=> {

            if(employee){
                req.flash("error_msg", "ssn_exist");
                res.redirect("/employee/add");
            }else{
                const newEmployee = new Employee({
                    user_name: req.body.user_name,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    ssn: req.body.ssn,
                    phone: req.body.phone
                })

                newEmployee.save().then(() => {
                    req.flash("success_msg", "registered");
                    res.redirect("/employee/add");
                }).catch((err)=>{
                    console.log(err);
                    req.flash("error_msg", "no registered");
                    res.redirect("/employee/add");
                })
            }
        }).catch((err)=> {
            res.redirect("/")
        })

    }
})

router.get("/add", (req, res) => {
    res.render("employee/add_employee");
})

router.get("/recovery", (req, res) => {
    res.render("employee/recovery_employee");
})

router.get("/recovery/search", (req, res) => { 
    Employee.find({user_name: req.query.user_name}).lean().then((employees) => {
        if(employees){
            res.render("employee/recovery_employee", {employees: employees});
        }else{
            req.flash("error_msg", "no find employee")
        }
    }). catch((err)=> {
        console.log(err)
    })
})

router.get("/description/:id", (req, res) => {
    Employee.findOne({_id: req.params.id}).lean().then((employee) => {
        if(employee){
            res.render("employee/description_employee", {employee: employee})
        }else{
            req.flash("error_msg", "no find employee");
            res.redirect("/home");
        }
    }). catch((err)=> {
        console.log(err)
    })    
})

router.get("/edit/:id", (req, res) => {
    console.log(req.params.id);
    Employee.findOne({_id: req.params.id}).lean().then((employee) => {
        if(employee){
            res.render("employee/edit_employee", {employee: employee})
        }else{
            req.flash("error_msg", "no find employee");
            res.redirect("/home");
        }
    }). catch((err)=> {
        console.log(err)
    })    
})

router.post("/update", (req, res) => {
    console.log("Chegou aqyu");
    Employee.replaceOne({_id: req.body.id}, 
    {user_name: req.body.user_name, 
     password: req.body.password, 
     first_name: req.body.first_name, 
     last_name: req.body.last_name,
     ssn: req.body.ssn, 
     phone: req.body.phone}
    ).lean().then((employee)=> {
        req.flash("success_msg", "Atualizado");
        res.redirect("/employee/recovery");

    }).catch((err)=> {
        req.flash("error_msg", "can't update");
        res.redirect("/employee/recovery");
    })    
})

router.get("/list", (req, res) => {
 
    Employee.find().lean().then((employees)=> {
        res.render("employee/recovery_employee", {employees: employees});
    }).catch((err)=> {
        req.flash("error_msg", "Não encontrado")
        console.log(err)
        res.redirect("/home")        
    })
    
})

router.post("/delete", (req, res) =>{
    Employee.deleteOne({_id: req.body.id}).lean().then((employee)=> {
        req.flash("success_msg", "deleted");
        res.redirect("/employee/recovery");
    }).catch((err)=> {
        req.flash("error_msg", "can't delete");
        res.redirect("/employee/recovery");
    })
})

module.exports = router
