'use strict';
require('dotenv').config();
// import { question } from 'readline-sync'
const readline = require('readline-sync');

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = process.env.CS;
var targetDevice = process.env.DEVICE;

var client = Client.fromConnectionString(connectionString);

client.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    let imsi = readline.question("enter imsi of target device: ");
    let c2d = readline.question("enter a message to send: ");
    var data = JSON.stringify({ imsi : imsi, message: c2d });
    var message = new Message(data);
    client.send(targetDevice, message, function (err, res) {
      if (err) console.log('error sending c2d message')
      else console.log(res)
    });
  }
});