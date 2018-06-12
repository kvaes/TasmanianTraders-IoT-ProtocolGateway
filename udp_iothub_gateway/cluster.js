'use strict';
'esversion:6';

const cluster = require('cluster');
const jsonfile = require('jsonfile');
const file = './dict.json';
var worker, dict;

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    dict = jsonfile.readFileSync(file);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
        worker.on('message', (msg) => {
            switch (msg.type) {
                case 'addImsi':
                    if (!dict.hasOwnProperty(msg.device.imsi)) {
                        dict[msg.device.imsi] = msg.device.ip;
                        jsonfile.writeFile(file, dict, (err) => {
                            if (err) console.error(err)
                        })
                        worker.send({
                            type: 'new_imsi'
                        });
                    }
                    break;
                case 'telemetry':
                    worker.send({
                        type: 'd2c',
                        imsi: msg.imsi,
                        payload: msg.payload
                    });
                    break;
                case 'c2d':
                    let ip = dict[msg.imsi];
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