'use strict';
require('dotenv').config();
var readline = require('readline-sync');
const dgram = require('dgram');
var client = dgram.createSocket('udp4');
client.bind(process.env.SOCKET);

const imsibase = '2061034000000';

const start = () => {
    var interval = setInterval(function () {
        sendData();
    }, process.env.TIMEOUT);
}

const sendData = () => {
    let imsisuffix = Math.round(Math.random() * (9 - 0) + 0);
    let payload = imsibase + imsisuffix + JSON.stringify({temperature: 12});

    client.send(payload, 0, payload.length, process.env.UDP_PORT, process.env.UDP_HOST, function (err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + process.env.UDP_HOST + ':' + process.env.UDP_PORT);
    });
}


start();