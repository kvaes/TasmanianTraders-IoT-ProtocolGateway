'use strict';
require('dotenv').config();
const cluster = require('cluster');
const udp_node = require('./udp-gw-node');

// azure sdk
const clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
const Client = require('azure-iot-device').Client;
var azure_client = clientFromConnectionString(process.env.CONN_STRING);

if (cluster.isMaster) {
    for (var i = 0; i < process.env.CPUS; i++) {
        cluster.fork();
    }
} else {
    udp_node.spawn(azure_client);
}
