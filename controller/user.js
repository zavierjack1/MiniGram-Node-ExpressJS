const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

JWT_KEY = process.env.JWT_KEY;

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash=>{
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result =>{
                    res.status(201).json({
                        message: "User created",
                        result: result
                    })
                })
                .catch(err =>{
                    res.status(500).json({
                        message: "Invalid authentication credentials"
                    })
                });
        });
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: "Authentication failed"
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);//returns new promise, chained to the next then
        })
        .then(result => {
            if (!result){
                return res.status(401).json({
                    message: "Authentication failed"
                })
            }

            const tokenDuration = 3600; //seconds
            const token = jwt.sign(
                {
                    email: fetchedUser.email,
                    userId: fetchedUser._id
                }, 
                JWT_KEY, //secreteOrPrivateKey
                {expiresIn: tokenDuration}
            );
            res.status(200).json(
                {
                    token: token,
                    expiresIn: tokenDuration,
                    userId: fetchedUser._id //userId is part of token but decoding would affect performance
                }
            )
        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication failed"
            })
        });
}