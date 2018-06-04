'use strict';
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const userver = dgram.createSocket('udp4');


// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var azure_client = clientFromConnectionString(process.env.CONN_STRING);


var sendToHub = (data) => {
    let imsi = data.substring(0,14);
    let payload = data.substring(14, data.length)
    let json = {imsi: imsi, payload: payload}
    let message = new Message(JSON.stringify(json));
    azure_client.sendEvent(message, (err, res) =>{
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
    sendToHub(buffer.toString());
    console.log(`server got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
});

var spawn = () => {
    userver.bind(process.env.PORT);
}

module.exports.spawn = spawn;