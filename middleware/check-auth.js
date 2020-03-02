const jwt = require('jsonwebtoken');

JWT_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
    try{
        //expecting "Bearer this_is_my_token1231254245234234234"
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, JWT_KEY);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch{
        res.status(401).json({
            message: "Authentication failed"
        })
    }
}