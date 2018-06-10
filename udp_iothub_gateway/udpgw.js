'use strict';
'esversion:6'
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const gw = dgram.createSocket('udp4');
//gw.bind(process.env.PORT);

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var az_client = clientFromConnectionString(process.env.CONN_STRING);
var Message = require('azure-iot-device').Message;

var sendToHub = (data, deviceIp) => {
    let imsi = data.substring(0, 14);
    // save this return address
    let returnAddr = {
        imsi: imsi,
        ip: deviceIp
    };
    process.send(returnAddr);

    let payload = data.substring(14, data.length)
    let json = {
        imsi: imsi,
        payload: payload
    }
    let message = new Message(JSON.stringify(json));

    az_client.sendEvent(message, (err, res) => {
        if (err)
            console.log('Message sending error: ' + err.toString());
        else
        if (res)
            console.log('payload sent to Iot Hub: ' + JSON.stringify(message));
    })
}

gw.on('listening', () => {
    const address = gw.address();
    console.log(`${process.pid} listening to raw udp datagrams at: ${address.address}:${address.port}`);
});

gw.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    gw.close();
});

gw.on('message', function (buffer, rinfo) {
    console.log(`server on ${process.pid} got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
    sendToHub(buffer.toString(), rinfo.address);
});

var spawn = (azClient) => {
    aclient = azClient;
    console.log('Server on ' + process.pid + ' started!');
    //userver.bind(process.env.PORT);
}

module.exports = gw;