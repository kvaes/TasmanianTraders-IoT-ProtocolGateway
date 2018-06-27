'use strict';
require('dotenv').config();
var readline = require('readline-sync');
const dgram = require('dgram');
var client = dgram.createSocket('udp4');
var server = dgram.createSocket('udp4');
client.bind(process.env.DEV_SOCKET);
server.bind(process.env.DEV_PORT);

const imsibase = '2061034000000';

const start = () => {
    var interval = setInterval(function () {
        sendData();
    }, process.env.TIMEOUT);
}

const sendData = () => {
    let payload = JSON.stringify({temperature: Math.random() * (14 - 12) + 12});

    client.send(payload, 0, payload.length, process.env.GW_PORT, process.env.GW_HOST, function (err, bytes) {
        if (err) throw err;
        console.log(`${JSON.stringify(payload)} sent to ${process.env.GW_HOST}:${process.env.GW_PORT}`);
    });
}

server.on('listening', function () {
    var address = server.address();
    console.log(`UDP Server listening on ${address.address}: ${address.port}`);
});

server.on('message', function (message, remote) {
    console.log(`${remote.address}:${remote.port} - ${message}`);
});

start();