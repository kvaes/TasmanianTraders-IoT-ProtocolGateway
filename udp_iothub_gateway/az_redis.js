var redis = require("redis");
var redis_client = redis.createClient(6379, 'udpgw-telenet.redis.cache.windows.net');

redis_client.on('connect', function () {
    redis_client.auth('IrSTVJLKBYdDHer0o2e80iGkUBC54gPXKR9f6Yn0zgA=', (err) => {
        if (err) console.log(err)
        else console.log(`azure redis cache client spawned: ${process.pid}`);

    })
});

process.on('message', (msg) => {
    switch (msg.type) {
        case 'pdp_ON':
            redis_client.set(msg.device.id, msg.device.ip);
            console.log(`PDP context created for ${msg.device.id}`)
            break;
        case 'pdp_OFF':
            redis_client.del(msg.device.id);
            console.log(`PDP context deleted for ${msg.device.id}`)
            break;
        default:
            break;
    }
});
module.exports = redis_client;