const dgram       = require('dgram')
    , packet      = require('coap-packet')
    , parse       = packet.parse
    , generate    = packet.generate
    , payload     = Buffer.from('Hello World')
    , message     = generate({ payload: payload })
    , url = 'localhost'
    , port        = 5683;

const client = dgram.createSocket('udp4');
client.send(message, 0, message.length, port, url, (err, bytes) => {
    client.close();
});