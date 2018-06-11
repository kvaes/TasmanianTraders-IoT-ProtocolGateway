'use strict';
'esversion:6';

// Load Koa
var Koa = require('koa');
var api = new Koa();
var Router = require('koa-router');
var koaBody = require('koa-body');

var router = new Router();
var counter = 0;
// consfigure app, databases
api
  .use(router.routes())
  .use(koaBody())
  .use(router.allowedMethods());

const jsonfile = require('jsonfile');
const file = './dict.json';
var dict = jsonfile.readFileSync(file);

console.log('api server spawned: ' + process.pid);

const getIP = (imsi) => {
  if (dict.hasOwnProperty(imsi))
    return dict[imsi];
  else
    return false;
}

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
    console.log(dict)
    ctx.body = dict;
  })
  .get('/ip/:id', (ctx, next) => {
    let result = {
      error: 'unkonw imsi'
    }
    let ip = getIP(ctx.params.id);
    if (ip)
      result = {
        ip: ip
      }

    ctx.body = result;
  })
  .post('/', koaBody(),
    (ctx) => {
      let ip = getIP(ctx.request.body.imsi);
      // => POST body
      ctx.body = {ip: ip};
    });

process.on('message', (msg) => {
  switch (msg.msgFromMaster) {
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

module.exports = api;