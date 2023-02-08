import Koa from 'koa';
import Router from 'koa-router';
import WebSocket from 'ws';
import bodyParser from 'koa-bodyparser';
import * as redis from 'redis'

const PORT = 3000
const REDIS_URL = "redis://localhost:6379";

async function main(){
  const redisClient = redis.createClient({url: REDIS_URL})
  redisClient.connect()

  const app = new Koa();
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    // const origin = process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : `http://127.0.0.1:${PORT}`;
    // ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    await next();
  });

  const router = new Router();

  router.get('/', (ctx) => {
    ctx.body = 'Hello, World!';
  });

  router.post('/leaderboard', async (ctx) => {
  console.log('form submit')
  console.log(ctx.request.body)
  // const { score, name }: any = ctx.request.body as Record<string, any> | undefined
  const { score, name } = ctx.request.body as any ?? {}

  if (!score || !name) {
    throw new Error('Must provide both score and name')
  }

  try {
    // const added = await redisClient.zAdd('leaderboard', [{value: name, score: score}]);
    const added = await redisClient.zAdd('leaderboard', [{value: name, score: score}]);
    console.log({added})
    redisClient.publish('leaderboard', 'added')
  } catch (err) {
    console.error(err)
  }

  // Get all of the values/scores from the sorted set using
  // the scan approach:
  // https://redis.io/commands/zscan
  // for await (const memberWithScore of redisClient.zScanIterator('leaderboard')) {
  //   console.log(memberWithScore);
  // }

  ctx.body = { success: true };
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  const server = app.listen(PORT);

  console.log(`Koa server listening on port: ${PORT}`)

  const wss = new WebSocket.Server({ server });
  // connect w/ ws://localhost:3000.

  wss.on('connection', async (ws) => {
    console.log('Client connected')
    ws.send('Welcome to the WebSocket server!');

    const subscriber = redisClient.duplicate()

    subscriber.on('error', err => console.error(err))
  
    await subscriber.connect()
    
    subscriber.subscribe('leaderboard', async (message, channel) => {
      console.log('sending websocket message on leaderboard update')
      console.log({message, channel})
      
      const replies = await redisClient.zRangeWithScores('leaderboard', '+inf', 0, {
        BY: 'SCORE',
        REV: true,
        LIMIT: { offset: 0, count: 5 }
      })
      
      console.log({replies})

      ws.send('leaderboard updated')
    })

    ws.on('message', async function message(data: any) {
      console.log(`received message with data: ${data}`)
    })
  });
};

main()