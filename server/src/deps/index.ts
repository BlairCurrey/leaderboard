import { config } from "../config";
import { Container } from 'inversify'
import "reflect-metadata"; // required for inversify
import { Redis } from '../Redis' 
import { KoaServer } from "../KoaServer";
import TYPES from "./types";


export async function initDependencies() {
  const container = new Container({ defaultScope: 'Singleton' })
  
  container
    .bind<typeof config>(TYPES.Config)
    .toConstantValue(config);
  container.bind<Redis>(TYPES.Redis).to(Redis)
  container.bind<KoaServer>(TYPES.KoaServer).to(KoaServer)
  
  return container
}