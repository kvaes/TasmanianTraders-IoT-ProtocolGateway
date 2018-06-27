'use strict';
'esversion:6';
//const winston = require('winston')
const cluster = require('cluster');
var worker;

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
        worker.on('message', (msg) => {
            switch (msg.type) {
                case 'pdp_ON':
                    console.log('[gw aaa] PDP_ON -------> [naster]');
                    worker.send({
                        type: 'conn_DEV',
                        device: msg.device
                    });
                    worker.send({
                        type: 'store_IP',
                        device: msg.device
                    });
                    break;
                case 'pdp_OFF':
                    console.log('[gw aaa] PDP_OFF ------> [naster]');
                    worker.send({
                        type: 'disconnect_device',
                        device: msg.device
                    });
                    break;
                case 'd2c':
                    console.log('[udp gw] d2c ------> [master]');
                    worker.send({
                        type: 'd2c',
                        ip: msg.ip,
                        payload: msg.payload
                    });
                    break;
                case 'c2d':
                    redis_client.get(msg.imsi, function (err, reply) {
                        // reply is null when the key is missing
                        debug('read ip from redis: ' + reply);
                    });
                    worker.send({
                        type: 'c2d',
                        deviceIP: ip,
                        payload: msg.payload
                    });
                    break;
                default:
                    break;
            }
        });
    }

    // Listen for dying workers
    cluster.on('exit', function () {
        cluster.fork();
    });
} else {
    require('./server');
}