const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
require('dotenv').config({path: __dirname + '/.env'})

const mongoUrl = process.env['mongoUrl'];
mongoose.connect('mongodb://meanuser:meanuser@'+mongoUrl+'/mean_course', {useNewUrlParser: true})
    .then(()=>{
        console.log('Connected to the DB');
    })
    .catch(()=>{
        console.log('Connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); //not used but nice-to-have
app.use("/images", express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    )
    next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;