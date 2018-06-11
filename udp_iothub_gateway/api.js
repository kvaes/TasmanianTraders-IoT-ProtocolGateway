// Load Koa
var Koa = require('koa');
var api = new Koa();
var Router = require('koa-router');
var router = new Router();
var body;

// consfigure app, databases
api
  .use(router.routes())
  .use(router.allowedMethods());
  
console.log('api server spawned: ' + process.pid);

// Load Routes
router
  .get('/', (ctx, next) => {
    ctx.body = 'home';
  })
  .get('/imsis', (ctx, next) => {
    let imsi = jsonfile.readFileSync(file)
    ctx.body = imsi;
  })
  .get('/imsi/:id', (ctx, next) => {
    ctx.body = 'The id you specified is: ' + ctx.params.id;
  })
  .post('/', (ctx, next) => {
    ctx.body = JSON.stringify({
      "what": "posted"
    });
  });

// other stuff
var jsonfile = require('jsonfile');
var file = './dict.json';


module.exports = api;