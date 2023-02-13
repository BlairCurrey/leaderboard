import { Container, inject, injectable } from "inversify" 
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import { Config }from './config'
import TYPES from './deps/types'
import { Redis } from "./Redis"
import { Server } from 'http'


@injectable()
export class KoaServer {
  private config: Config
  private redis: Redis
  public router: Router
  public koa: Koa

  constructor(
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.Redis) redis: Redis
  ){
    this.config = config
    this.redis = redis
    this.koa = new Koa()

    this.koa.use(bodyParser());
    this.koa.use(this._allowOriginHeaders());

    // this.koa.context = { 
    //   ...this.koa.context, 
    //   redis: this.redis 
    // }

    this.router = new Router()
    this._setRoutes()
    
    // TODO: is this redundant given the header set in allowOriginHeaders?
    // Alternatively, could putting this where alloworiginheaders is resolve the issue
    // resolver origing headers was tring to sovle?
    this.koa.use(this.router.allowedMethods());
  }

  public listen(port: number) {
    return this.koa.listen(this.config.PORT);
  }


  private _allowOriginHeaders (): Koa.Middleware {
    return async (ctx, next) => {
      // const origin = process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : `http://127.0.0.1:${PORT}`;
      // ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type');
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      await next();
    }
  }

  private _setRoutes() {
    this.router.get('/healthz', this._healthCheckRoute)
    this.router.post('/leaderboard', async (ctx) => this._submitScoreRoute(ctx))

    this.koa.use(this.router.routes());
  }

  _healthCheckRoute(ctx: any){
    ctx.body = { status: 200, success: true }
    ctx.status = 200
  }

  async _submitScoreRoute(ctx: any){
    console.log('form submit')
    console.log(ctx.request.body)
    // const { score, name }: any = ctx.request.body as Record<string, any> | undefined
    const { score, name } = ctx.request.body as any ?? {}

    if (!score || !name) {
      throw new Error('Must provide both score and name')
    }

    try {
      // const added = await redisClient.zAdd('leaderboard', [{value: name, score: score}]);
      const added = await this.redis.client.zAdd('leaderboard', [{value: name, score: score}]);
      console.log({added})
      this.redis.client.publish('leaderboard', 'added')
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
  }
}
