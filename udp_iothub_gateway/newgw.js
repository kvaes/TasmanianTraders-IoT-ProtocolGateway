'use strict';
'esversion:6';
require('dotenv').config();
// raw udp datagrams
const dgram = require('dgram');
const gw = dgram.createSocket('udp4');

gw.on('listening', () => {
    const address = gw.address();
    console.log(`udpgw node spawned: ${process.pid}`);
});

gw.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    gw.close();
});

gw.on('message', function (buffer, rinfo) {
    console.log(`server on ${process.pid} got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
    process.send({
        type: 'telemetry',
        data: buffer.toString()
    });
    //sendToHub(buffer.toString(), rinfo.address);
});