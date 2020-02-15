const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        //expecting "Bearer this_is_my_token1231254245234234234"
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    }
    catch{
        res.status(401).json({
            message: "Authentication failed"
        })
    }
}