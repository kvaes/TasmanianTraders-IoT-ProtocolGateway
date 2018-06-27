'use strict';
'esversion:6';
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const gw = dgram.createSocket('udp4');

var msgCounter = 0;

gw.on('listening', () => {
    const address = gw.address();
    console.log(`udp_front_end [pid:${process.pid}] listening on port: ${address.port}`);
});

gw.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    gw.close();
});

gw.on('message', (buffer, rinfo) => {
    console.log('[device] d2c ------> [udpgw]');

    process.send({
        type: 'd2c',
        ip: rinfo.address,
        payload: buffer.toString()
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