'esversion: 6';

var redis = require("redis");
var redis_client = redis.createClient(6379, 'udpgw-telenet.redis.cache.windows.net');

redis_client.on('connect', function () {
    redis_client.auth('IrSTVJLKBYdDHer0o2e80iGkUBC54gPXKR9f6Yn0zgA=', (err) => {
        if (err) console.log(err);
        else console.log(`azure redis cache client spawned: ${process.pid}`);

    })
});

process.on('message', (msg) => {
    switch (msg.type) {
        case 'store_IP':
            console.log('[master] STORE_IP ---> [az_redis]');
            let ip = msg.device.ip;
            //redis_client.set(msg.device.id, msg.device.ip);
                redis_client.hmset(ip, {
                    'id': msg.device.id,
                    'cs': 'null'
                });
            break;
        case 'del_IP':
            redis_client.del(msg.device.id);
            break;
        default:
            break;
    }
});
module.exports = redis_client;