'use strict';
'esversion:6';
require('dotenv').config();

const Protocol = require('azure-iot-device-amqp').Amqp;
const Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var msgCounter = 0;
//var connectionString = 'HostName=telenet-nbiot-hub.azure-devices.net;DeviceId=udpgw2;SharedAccessKey=naOCZpCTzGV05fQONyP2rLU3DlKYlO22VXj9W1Qzh88=';
const connectionString = process.env.CONN_STRING;
var iot_client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = (err) => {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log(`azure iot client connected to: ${process.pid}`);

    iot_client.on('message', (msg) => {
      let data = JSON.parse(msg.data);
      process.send({
        type: 'c2d',
        imsi: data.imsi,
        payload: data.message
    });
      iot_client.complete(msg, printResultFor('completed'));
    });

    iot_client.on('error', (err) => {
      console.error(err.message);
    });

    iot_client.on('disconnect', () => {
      io_client.removeAllListeners();
      iot_client.open(connectCallback);
    });
  }
};

iot_client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

process.on('message', (msg) => {
  switch (msg.type) {
      case 'd2c':
          //send this UDP datagram to the ipAddress of the imsi
          console.log(`${process.pid} will send ${msg.payload} to: ${msg.imsi}`);
          let json = {
            imsi: msg.imsi,
            payload: msg.payload
        } ;
        let message = new Message(JSON.stringify(json));
          iot_client.sendEvent(message, (err, res) => {
            if (err)
                console.log('Message sending error: ' + err.toString());
            else {
                msgCounter++;
                console.log(`message sent by ${process.pid}: ${msgCounter}`);
            }
          })
          break;
      default:
          break;
  }
});

module.exports = iot_client;
