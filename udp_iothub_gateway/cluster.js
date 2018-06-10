var cluster = require('cluster');
var worker; 
var device_dict = {};

if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    worker = cluster.fork();
    worker.on('message', function (device) {
        if (!device_dict.hasOwnProperty(device.imsi)) 
            device_dict[device.imsi] = device.ip;

            console.log('dict updated: ' + JSON.stringify(device_dict));

    });
  }

  // Listen for dying workers
  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
  require('./server');
}