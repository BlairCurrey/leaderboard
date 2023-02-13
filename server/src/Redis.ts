import { createClient, RedisClientType } from 'redis'
import { inject, injectable } from "inversify" 
import { Config }from './config'
import TYPES from './deps/types'


@injectable()
export class Redis {
  private config: Config

  public client: RedisClientType

  constructor(@inject(TYPES.Config) config: Config) {
    this.config = config
    this.client = createClient({url: this.config.REDIS_URL})
  }
}