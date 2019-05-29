const express = require('express');

const dbRouter = require('../data/dbRouter.js')

const server = express();

server.use(express.json());

server.get('/', (req,res) => {
    res.send('Hello from Express');
});

server.use('/api/posts', dbRouter);



module.exports = server;
