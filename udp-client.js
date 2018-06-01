'use strict';
require('dotenv').config();

// raw udp datagrams
var dgram = require('dgram');
var userver = dgram.createSocket('udp4');
const port = 41234;

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var azure_client = clientFromConnectionString(process.env.CONN_STRING);


var sendToHub = (data) => {
    let message = new Message(data);

    azure_client.sendEvent(message, (err, res) =>{
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
        if (res)
            console.log('temperature sent to Iot Hub: ' + JSON.stringify(message));
    })
}

userver.on('listening', () => {
    const address = userver.address();
    console.log(`listening to raw udp datagrams at: ${address.address}:${address.port}`);
});

userver.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    userver.close();
});

userver.on('message', function (buffer, rinfo) {
    udp_msg_counter++;
    sendToHub(new Message(buffer.toString()));
    console.log(`server got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
});

userver.bind(port);