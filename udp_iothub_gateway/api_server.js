'use strict';
'esversion:6';

// Load Koa
var Koa = require('koa');
var api_server = new Koa();
var Router = require('koa-router');
var koaBody = require('koa-body');

var router = new Router();
var counter = 0;
// consfigure app, databases
api_server
  .use(router.routes())
  .use(koaBody())
  .use(router.allowedMethods());

console.log('api_server server spawned: ' + process.pid);

// Load Routes
router
  .get('/', (ctx, next) => {
    ctx.body = {
      text: "a simple counter to display how many times this api was called",
      counter: counter
    };
    counter++;
  })
  .get('/imsis', (ctx, next) => {
    //console.log('dict: ' + JSON.stringify(dict))
    ctx.body = 'now the imsis are in redis, think about this';
  })
  .get('/ip/:id', (ctx, next) => { //fix this - not working since redis
    let result = {
      error: 'unkonw imsi'
    }

    redis_client.get(ctx.params.id, function (err, reply) {
      if (err)
        result = err
      else
        result = {
          ip: reply
        }
      ctx.body = result;
    });
  })
  .post('/', koaBody(),
    (ctx) => {
      process.send({
        type: 'c2d',
        body: ctx.request.body
      });
      let ip = getIP(ctx.request.body.imsi);
      ctx.body = {
        ip: ip
      };
    });

api_server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = api_server;