'use strict';
require('dotenv').config();
const cluster = require('cluster');
const udp_node = require('./udp-gw-node');

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var azure_client = clientFromConnectionString(process.env.CONN_STRING);

var worker;
var device_dict = {};

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < process.env.CPUS; i++) {
        worker = cluster.fork();

        worker.on('message', function (device) {
            if (!device_dict.hasOwnProperty(device.imsi))
                device_dict[device.imsi] = device.ip;
        });
    }
} else {
    udp_node.spawn(azure_client);
    // implement messages from workers to master
    // process.on('message', function (msg) {});
}

const pigBack = () => {
    console.log('send message to device')
}
module.exports.pigBack = pigBack;