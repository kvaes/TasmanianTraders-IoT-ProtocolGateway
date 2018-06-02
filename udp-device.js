const PORT = 41234;
var HOST = '127.0.0.1';
var readline = require('readline-sync');


const imsibase = '2061034000000';
const dgram = require('dgram');
var client = dgram.createSocket('udp4');

var sendData = () => {
    let imsisuffix = Math.round(Math.random() * (9 - 0) + 0);
    let data = readline.question("data to send?");
    let payload = imsibase + imsisuffix + data;

    client.send(payload, 0, payload.length, PORT, HOST, function (err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST + ':' + PORT);
        client.close();
    });
}


sendData();