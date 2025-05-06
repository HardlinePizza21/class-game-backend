const {io} = require('socket.io-client');
require('dotenv').config();
const socket = io('http://localhost:4000');

for (let i = 0; i < 5; i++) {
    socket.emit('sendAnswer', `Estas las respuesta placer holder numero ${i}, es solo para que se ve lindo`)
}
