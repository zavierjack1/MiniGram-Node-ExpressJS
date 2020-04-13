const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_KEY = process.env.JWT_KEY

exports.createAdmin = () => {
    const admin_email = process.env.ADMIN_EMAIL;
    const admin_pw = process.env.ADMIN_PW;
    User.findOne({email: admin_email})
        .then(user => {
            if(!user){
                console.log("creating admin account: "+admin_email);
                bcrypt.hash(admin_pw, 10)
                    .then(hash=> {
                        const user = new User({
                            email: admin_email, 
                            password: hash, 
                            admin: true
                        });

                        user.save()
                            .then(result => {
                                console.log("admin created!");
                            })
                    });
            }
            else{
                console.log("Admin already exists");
            }
        })
}

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
                    userData: {
                        userId: fetchedUser._id,
                        email: fetchedUser.email,
                        admin: fetchedUser.admin
                    }
                }
            )
        })
        .catch(err => {
            return res.status(401).json({
                message: "Authentication failed"
            })
        });
}

exports.getUserById = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            if(user){
                transformedUser={
                    id: user._id,
                    email: user.email,
                    admin: user.admin
                }
                res.status(200).json(transformedUser);
            }
            else{
                res.status(404).json({
                    message: 'User not found'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "get post failed"
            })
        });
}