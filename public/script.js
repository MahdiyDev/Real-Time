const socket = io('http://localhost:4300')
const videoGrid = document.getElementById('video')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '4301'
})

let peers = {}

myPeer.on('open', id => {
    socket.emit('join', ROOM_ID, id)
    // socket.emit('disconnect', ROOM_ID, id)
})

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToUser(userId, stream)
    })
})

// socket.on('user-disconnected', () => {
//     if (peers[userId]) peers[userId].close()
// })

socket.emit('join', ROOM_ID, 10)
// socket.emit('disconnect', ROOM_ID, 10)

function connectToUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
