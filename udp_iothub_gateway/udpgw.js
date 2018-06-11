'use strict';
'esversion:6';
require('dotenv').config();

// raw udp datagrams
const dgram = require('dgram');
const gw = dgram.createSocket('udp4');

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var az_client = clientFromConnectionString(process.env.CONN_STRING);
var Message = require('azure-iot-device').Message;
var msgCounter = 0;

az_client.on('message', function (msg) {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg,  _ = (err, res) => {
        if (err) console.log('error sending c2d message')
      });
  });

var sendToHub = (data, deviceIp) => {
    let imsi = data.substring(0, 14);
    let returnAddr = {
        imsi: imsi,
        ip: deviceIp
    };
    process.send({
        type: 'addImsi',
        device: returnAddr
    });

    let payload = data.substring(14, data.length)
    let json = {
        imsi: imsi,
        payload: payload
    }
    let message = new Message(JSON.stringify(json));

    az_client.sendEvent(message, (err, res) => {
        if (err)
            console.log('Message sending error: ' + err.toString());
        else {
            msgCounter++;
            console.log(`message sent by ${process.pid}: ${msgCounter}`);
        }
    })
}

gw.on('listening', () => {
    const address = gw.address();
    console.log(`udpgw node spawned: ${process.pid}`);
});

gw.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    gw.close();
});

gw.on('message', function (buffer, rinfo) {
    //console.log(`server on ${process.pid} got: ${buffer} from ${rinfo.address}:${rinfo.port}`);
    sendToHub(buffer.toString(), rinfo.address);
});

process.on('message', (msg) => {
    switch (msg.type) {
        case 'c2d':
        //s end this UDP datagram to the ipAddress of the imsi
            console.log(`udp server on ${process.pid} will send message to: ${msg.deviceIP}`);
            let payload = msg.message
            let device = dgram.createSocket('udp4');
            device.bind({address: msg.deviceIP});
            device.send(payload, 0, payload.length, process.env.DEV_PORT, msg.deviceIP, function (err, bytes) {
                if (err) throw err;
            });
            break;
        default:
            break;
    }
});
module.exports = gw;