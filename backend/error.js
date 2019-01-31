module.exports = {
    Handle:function(error,req,res,next) {
        if(error.status == 404)
            res.status(404).json({
                title: "Wystąpił błąd API 404",
                message: "Nie znaleziono",
            });
        else if(error.status == 403)
            res.status(403).json({
                title: "Brak uprawnień",
                message: "Twoje konto nie posiada wymaganych uprawnień.",
            });
        else if(error.status == 401)
            res.status(401).json({
                title: "Wymagane zalogowanie",
                message: "Proszę się zalogować",
            });
        else if(error.status == 400)
            res.status(400).json({
                title: "Wystąpił błąd",
                message: error.message,
            });
        else if(error.status == 500)
            res.status(500).json({
                title: "Wystąpił błąd serwera",
                message: error.message,
            });
        else
            res.status(500);
    }
}