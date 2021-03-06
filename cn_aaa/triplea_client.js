'use strict';
require('dotenv').config();

var radius = require('./lib/radius');
var dgram = require('dgram');
var readline = require('readline-sync');
var secret = 'radius_secret';


var accounting_start = {
  code: "Accounting-Request",
  secret: secret,
  identifier: 0,
  attributes: [
    ['Acct-Status-Type', 1],
    ['Framed-IP-Address', '::1'],
    ['User-Name', '2401011234561234']
    //['User-Password', 'beverly123']
  ]
};

var accounting_stop = {
  code: "Accounting-Request",
  secret: secret,
  identifier: 0,
  attributes: [
    ['Acct-Status-Type', 2],
    ['Framed-IP-Address', '::1'],
    ['User-Name', '2401011234561234']
    //['User-Password', 'beverly123']
  ]
};


var client = dgram.createSocket("udp4");
//client.bind(process.env.AAA_SOCKET);
client.bind({address: '0.0.0.0',port: 49001});

client.on('listening', function () {
  var address = client.address();
  console.log(`AAA DEVICE listening on ${address.address}: ${address.port}`);
});

client.on('message', function (message, remote) {
  console.log(`${remote.address}:${remote.port} - ${message}`);
});

var sent_packets = {};

var sendRadius = (choice) => {
  var operation;

  switch (choice) {
    case '1':
      operation = accounting_start;
      break;
    case '2':
      operation = accounting_stop;
      break;
    default:
      console.log('not a valid operation');
  }

  var encoded = radius.encode(operation);
  sent_packets[operation.identifier] = {
    raw_packet: encoded,
    secret: operation.secret
  };
  client.send(encoded, 0, encoded.length, 1812, process.env.AAA_SERVER, (err, bytes) => {
    if (err) throw err;
    console.log(`${operation.code} sent to ${process.env.AAA_HOST}:${process.env.AAA_PORT}`);
});
  console.log(`sent ${encoded.length} bytes`);
}

var prompt = () => {
  var choice = readline.question('(1) accounting start\n(2) accounting stop\n\n? ');
  sendRadius(choice)
}

prompt();



/*
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
    console.log(`UDP DEVICE listening on ${address.address}: ${address.port}`);
});

server.on('message', function (message, remote) {
    console.log(`${remote.address}:${remote.port} - ${message}`);
});

start();
*/