'use strict';
'esversion:6';
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const gw = dgram.createSocket('udp4');

/*
// azure sdk
var Protocol = require('azure-iot-device-amqp').Amqp;
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var az_client = clientFromConnectionString(process.env.CONN_STRING);
var Message = require('azure-iot-device').Message;
*/
var msgCounter = 0;

gw.on('listening', () => {
    const address = gw.address();
    console.log(`udpgw node spawned: ${process.pid}`);
});

gw.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    gw.close();
});

gw.on('message', (buffer, rinfo) => {
    console.log(`server on ${process.pid} got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
    let body = buffer.toString();
    let imsi = body.substring(0, 14);
    let payload = body.substring(14, body.length);

    process.send({
        type: 'telemetry',
        imsi: imsi,
        message: payload
    });

    process.send({
        type: 'addImsi',
        device: {
            imsi: imsi,
            ip: rinfo.address
        }
    });
});

process.on('message', (msg) => {
    switch (msg.type) {
        case 'c2d':
            // console.log(`udp server on ${process.pid} will send ${msg.payload} to: ${msg.deviceIP}`);
            let payload = msg.payload;
            let device = dgram.createSocket('udp4');
            
            device.bind({ address: msg.deviceIP });
            device.send(payload, 0, payload.length, process.env.DEV_PORT, msg.deviceIP, function (err, bytes) {
                if (err) throw err;
            });
            
            break;
        default:
            break;
    }
});

module.exports = gw;