var radius = require('./lib/radius');
var dgram = require("dgram");
var secret = 'radius_secret';
var radiusfe = dgram.createSocket("udp4");

radiusfe.on("message", function (msg, rinfo) {
  try {
    var packet = radius.decode({
        packet: msg,
        secret: secret
      }),
      type;

    switch (packet.attributes["Acct-Status-Type"]) {
      case 'Start':
        type = 'pdp_ON';
        console.log('[cn aaa] ACC_START ----> [gw aaa]');
        break;
      case 'Stop':
        type = 'pdp_OFF';
        console.log('[cn aaa] PDP_OFF----> [gw aaa]');
        break;
      default:
        console.log('not a valid accounting operation, ignoring');
        break;
    }

    process.send({
      type: type,
      device: {
        id: packet.attributes["User-Name"],
        ip: packet.attributes["Framed-IP-Address"]
      }
    });
  } catch (e) {
    console.log("Failed to decode radius packet, silently dropping:", e);
    return;
  }
});
console.log(`radius client spawned: ${process.pid}`);
module.exports = radiusfe;