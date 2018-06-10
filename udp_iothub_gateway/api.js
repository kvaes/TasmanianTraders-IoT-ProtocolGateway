// Load Koa
var Koa = require('koa');
var api = new Koa();
var Router = require('koa-router');
var router = new Router();

// consfigure app, databases
api
  .use(router.routes())
  .use(router.allowedMethods());
console.log('api server spawned: ' + process.pid)

// Load Routes
router
  .get('/', (ctx, next) => {
    ctx.body = 'Home of UDP!';
  })
  .get('/hello', (ctx, next) => {
    ctx.body = 'Hello!';
  })
  .get('/:id', (ctx, next) => {
    ctx.body = 'The id you specified is: ' + ctx.params.id;
  })
  .post('/', (ctx, next) => {
    ctx.body = JSON.stringify({
      "what": "posted"
    });
  });

module.exports = api;