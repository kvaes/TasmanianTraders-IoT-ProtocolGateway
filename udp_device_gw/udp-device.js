'use strict';
require('dotenv').config();
var readline = require('readline-sync');
const dgram = require('dgram');

const imsibase = '2061034000000';
var client = dgram.createSocket('udp4');

var sendData = () => {
    let imsisuffix = Math.round(Math.random() * (9 - 0) + 0);
    let data = readline.question("data to send?");
    let payload = imsibase + imsisuffix + data;

    client.send(payload, 0, payload.length, process.env.PORT, process.env.HOST, function (err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + process.env.HOST + ':' + process.env.PORT);
        client.close();
    });
}


sendData();