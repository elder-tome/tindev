const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query

    connectedUsers[ user ] = socket.id

})

mongoose.connect('mongodb://localhost:27017/tindev',{useNewUrlParser: true})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    next()
})

app.use(cors())

app.use(express.json())

app.use(routes)

server.listen(3333)

