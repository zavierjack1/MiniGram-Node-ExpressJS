const http = require('http'); //default node js pacakge

const server = http.createServer((req, res) => {
    res.end('this is my first response');
});

server.listen(process.env.PORT || 8080);