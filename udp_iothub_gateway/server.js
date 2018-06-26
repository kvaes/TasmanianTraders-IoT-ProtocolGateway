'use strict';
'esversion:6';
require('dotenv').config();

const api_server = require('./api_server');
/**
 * Event listener for HTTP server "error" event.
 */


/**
 * Event listener for HTTP server "listening" event.
 */


const iotdev = require('./iot_dev');

const udpgw = require('./udpgw');
udpgw.bind(process.env.GW_PORT);

const radiusfe = require('./radius_frontend');
const az_redis = require('./az_redis')





