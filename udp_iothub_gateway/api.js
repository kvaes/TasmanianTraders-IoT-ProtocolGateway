'use strict';
'esversion:6';

// Load Koa
var Koa = require('koa');
var api = new Koa();
var Router = require('koa-router');
var koaBody = require('koa-body');

var redis = require("redis"),
  redis_client = redis.createClient();

var router = new Router();
var counter = 0;
// consfigure app, databases
api
  .use(router.routes())
  .use(koaBody())
  .use(router.allowedMethods());

//const jsonfile = require('jsonfile');
//const file = './dict.json';
//var dict = jsonfile.readFileSync(file);

console.log('api server spawned: ' + process.pid);



// Load Routes
router
  .get('/', (ctx, next) => {
    console.log(dict)
    ctx.body = {
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

/*
process.on('message', (msg) => {
  switch (msg.type) {
    case 'new_imsi':
      jsonfile.readFile(file, (err, obj) => {
        if (obj != undefined) {
          dict = obj;
          console.log('new dict: ' + JSON.stringify(dict));
        }
      });
      break;
    default:
      break;
  }
});
*/

module.exports = api;