const api = require('./api');
const udpgw = require('./udpgw');

api.listen(3000);
udpgw.bind(process.env.PORT);


