'use strict';
'esversion:6';

const cluster = require('cluster');
const jsonfile = require('jsonfile')
const file = './dict.json';
var worker, dict;

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    dict = jsonfile.readFileSync(file);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
        worker.on('message', (device) => {
                    if (!dict.hasOwnProperty(device.imsi)) {
                        dict[device.imsi] = device.ip;
                        jsonfile.writeFile(file, dict, (err) => { if (err) console.error(err) })
                        worker.send({msgFromMaster: 'new_imsi'});
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