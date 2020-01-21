const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

//mongoose.connect('mongodb://mongoadmin:secret@my_mongo:27017/test?retryWrites=true')
mongoose.connect('mongodb://meanuser:meanuser@my_mongo:27017/mean_course', {useNewUrlParser: true})
    .then(()=>{
        console.log('Connected to the DB');
    })
    .catch(()=>{
        console.log('Connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); //not used but nice-to-have

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    )
    next();
});

app.use('/api/posts', postRoutes);


module.exports = app;