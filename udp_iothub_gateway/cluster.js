'use strict';
'esversion:6';

const cluster = require('cluster');
const jsonfile = require('jsonfile');
var redis = require("redis"),
    redis_client = redis.createClient();
const file = './dict.json';
var worker;
    // var dict;

    if (cluster.isMaster) {
        // Count the machine's CPUs
        var cpuCount = require('os').cpus().length;
        // replace dictionary in file system with redis
        //    dict = jsonfile.readFileSync(file);
        redis_client.on("error", function (err) {
            console.log("Error " + err);
        });

        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i += 1) {
            worker = cluster.fork();
            worker.on('message', (msg) => {
                switch (msg.type) {
                    case 'addImsi':
                        // replace dictionary in file system with redis
                        // if (!dict.hasOwnProperty(msg.device.imsi)) {

                        // maybe this should be on the workers -> THINK LATER
                        redis_client.set(msg.device.imsi, msg.device.ip);
                        /*
                        dict[msg.device.imsi] = msg.device.ip;
                        jsonfile.writeFile(file, dict, (err) => {
                            if (err) console.error(err)
                        })
                        */
                        worker.send({
                            type: 'new_imsi'
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
    }
else {
    require('./server');
}