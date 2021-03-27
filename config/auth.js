const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//MODEL USUARIO

require("../models/user")
const User = mongoose.model("user")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'},(email, password, done)=>{
        User.findOne({email: email}).then((user)=> {
            if(!user){
                return done(null, false , {message: "Esta conta não existe"})
            }

            bcrypt.compare(password, user.password, (erro, batem) => {

                if(batem){
                    return done(null,  user)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=> {

        done(null, usuario);
    })

    passport.deserializeUser((usuario, done) => {
        done(null, usuario);
    })

}