import { Container } from "inversify"
import { Config } from "./config"
import TYPES from "./deps/types"
import { KoaServer } from "./KoaServer"
import { Redis } from "./Redis"
import WebSocket from 'ws';

export default class App {
  private koaServer: KoaServer
  private redis: Redis
  private config: Config
  
  public constructor(private deps: Container) {
    this.config = deps.get(TYPES.Config)
    this.redis = deps.get(TYPES.Redis)
    this.koaServer = deps.get(TYPES.KoaServer)
  }

  public async start(): Promise<void> {
    await this.redis.client.connect()
    const server = this.koaServer.listen(this.config.PORT)
    console.log(`Koa server listening on port: ${this.config.PORT}`)

    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws) => {
      console.log('Client connected')
      ws.send('Welcome to the WebSocket server!');

      const subscriber = this.redis.client.duplicate()

      subscriber.on('error', err => console.error(err))
    
      await subscriber.connect()
      
      subscriber.subscribe('leaderboard', async (message, channel) => {
        console.log('sending websocket message on leaderboard update')
        console.log({message, channel})
        
        const leaderboard = await this.redis.client.zRangeWithScores('leaderboard', '+inf', 0, {
          BY: 'SCORE',
          REV: true,
          LIMIT: { offset: 0, count: 10 }
        })
        
        console.log({leaderboard})

        ws.send(JSON.stringify({leaderboard}))
      })

      ws.on('message', async function message(data: any) {
        console.log(`received message with data: ${data}`)
      })
    });
  }
}
