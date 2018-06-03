'use strict';
require('dotenv').config();
const cluster = require('cluster');
const udp_node = require('./udp-gw-node');

if (cluster.isMaster) {
    for (var i = 0; i < process.env.CPUS; i++) {
        cluster.fork();
    }
} else {
    udp_node.spawn();
}
