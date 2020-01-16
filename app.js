const express = require('express');

const app = express();

//next just allows request to continue 
app.use((req, res, next) => {
    console.log("first middleware");
    next();
});

app.use((req, res, next) => {
    //console.log("second middleware");
    res.send('Hello from express!');
});

module.exports = app;