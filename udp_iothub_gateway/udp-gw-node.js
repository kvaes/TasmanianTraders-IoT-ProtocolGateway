'use strict';
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const userver = dgram.createSocket('udp4');
var aclient = null;

var Message = require('azure-iot-device').Message;

var sendToHub = (data) => {
    let imsi = data.substring(0,14);
    let payload = data.substring(14, data.length)
    let json = {imsi: imsi, payload: payload}
    let message = new Message(JSON.stringify(json));
    console.log('send to hub: ' + message)

    aclient.sendEvent(message, (err, res) =>{
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
        if (res)
            console.log('payload sent to Iot Hub: ' + JSON.stringify(message));
    })
}

userver.on('listening', () => {
    const address = userver.address();
    //console.log(`listening to raw udp datagrams at: ${address.address}:${address.port}`);
});

userver.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    userver.close();
});

userver.on('message', function (buffer, rinfo) {
    console.log(`server on ${process.pid} got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
    sendToHub(buffer.toString());
});

var spawn = (azClient) => {
    aclient = azClient;
    console.log('Server on ' + process.pid + ' started!');
    userver.bind(process.env.PORT);
}

module.exports.spawn = spawn;