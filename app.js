const express = require('express');

const app = express();

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
})

app.use('/api/posts',(req, res, next) => {
    const posts = [
        {
            id: 'some_random_id1',
            title: 'first',
            content: 'this is coming from the Express Server'
        },
        {
            id: 'some_random_id2',
            title: 'second',
            content: 'this is the second post coming from the Express Server'
        }
    ];
    res.status(200).json({
        message: 'Post fetched successfully',
        posts: posts
    });
});

module.exports = app;