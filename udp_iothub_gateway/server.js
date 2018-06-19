'use strict';
'esversion:6';

const api = require('./api');
api.listen(3000);

const iotdev = require('./iot_dev');

const udpgw = require('./udpgw');
udpgw.bind(process.env.GW_PORT);

const radiusfe = require('./radius_frontend');
const az_redis = require('./az_redis')





