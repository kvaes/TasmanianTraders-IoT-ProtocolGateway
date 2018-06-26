'use strict';
'esversion:6';

const cluster = require('cluster');
//const jsonfile = require('jsonfile');

//const file = './dict.json';
var worker;
// var dict;

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // replace dictionary in file system with redis
    //    dict = jsonfile.readFileSync(file);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
        worker.on('message', (msg) => {
            switch (msg.type) {
                case 'pdp_ON':
                    // connect a client for this device
                    worker.send({
                        type: 'pdp_ON',
                        device: msg.device
                    });
                    worker.send({
                        type: 'connect_device',
                        device: msg.device
                    });
                    //}
                    break;
                case 'pdp_OFF':
                    // disconnect the client for this device

                    worker.send({
                        type: 'disconnect_device',
                        device: msg.device
                    });

                    //}
                    break;
                case 'telemetry':
                    worker.send({
                        type: 'd2c',
                        imsi: msg.imsi,
                        payload: msg.message
                    });
                    break;
                case 'c2d':
                    // replace dictionary in file system with redis
                    // let ip = dict[msg.imsi];

                    redis_client.get(msg.imsi, function (err, reply) {
                        // reply is null when the key is missing
                        console.log('read ip from redis: ' + reply);
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