import { initDependencies } from './deps'
import App from './app'

async function main () {
  const deps = await initDependencies()
  const app = new App(deps)
  
  app.start()
}

main()