// Example radius client sending auth packets.

var radius = require('./lib/radius');
var dgram = require('dgram');
var util = require('util');
var readline = require('readline-sync');

var secret = 'radius_secret';


var accounting_start = {
  code: "Accounting-Request",
  secret: secret,
  identifier: 0,
  attributes: [
    ['Acct-Status-Type', 1],
    ['Framed-IP-Address', '10.5.5.5'],
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
    ['Framed-IP-Address', '10.5.5.5'],
    ['User-Name', '2401011234561234']
    //['User-Password', 'beverly123']
  ]
};


var client = dgram.createSocket("udp4");
client.bind(49001);

var sent_packets = {};

var send = (choice) => {
  switch (choice) {
    case '1':
      operation = accounting_start;
      break;
    case '2':
      operation = accounting_stop;
      break;
    case '3':
      process.exit(0);
      break;
    default:
      console.log('not a valid operation');
  }

  var encoded = radius.encode(operation)
  sent_packets[operation.identifier] = {
    raw_packet: encoded,
    secret: operation.secret
  };
  client.send(encoded, 0, encoded.length, 1812, "localhost");
  console.log('sent')
  console.log('\n**********************************')
}

var prompt = () => {
  var choice = readline.question('(1) accounting start\n(2) accounting stop\n(3) exit program? ');
  send(choice)
}

prompt();