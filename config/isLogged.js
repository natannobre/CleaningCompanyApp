module.exports = {
    isLogged: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Você deve está logado para entrar aqui!")
        res.redirect("/login")
    }
}