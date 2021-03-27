module.exports = {
    eAdmin: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("erro_msg", "Você deve está logado para entrar aqui!")
        res.redirect("/")
    }
}