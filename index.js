const express = require('express')
const bodyParser = require('body-parser')

const api = express();
const server = require("http").Server(api);

let route

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});


api.use(express.static('public'))
api.use(bodyParser.json())

api.listen(process.env.PORT, () => {
    console.log('Api Running')
})

api.get("/api", (req, res) => {
    res.send(route)
})

api.post('/location-details', (req, res) => {
    console.log(req.body)
    route = req.body
})

server.listen(process.env.PORT || 3000);