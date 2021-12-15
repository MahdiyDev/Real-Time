require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const { v4: UUID } = require('uuid')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${UUID()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
    })

    // socket.on('disconnect', (roomId, userId) => {
    //     socket.to(roomId).emit('user-disconnected', userId)
    // })
})

server.listen(process.env.PORT, () => {
    console.log('server listen in http://localhost:' + process.env.PORT);
})
