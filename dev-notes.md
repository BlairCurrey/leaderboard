# TODO
- [ ] send leaderboard on initial page load
  - [ ] through ws connection or new route?
    - i think if we do anew route and use the svelte load function then it can be retrieved on initial SSR
    - we also need a seperate route if we ever want to fetch by page
  - [ ] extract redis "query" into seperate function
  - [ ] ensure table is populated from redis in initial ws connection
- [ ] Make new Leaderboard service
  - Redis dependency
  - put /leaderboard post and get in this
  - move Redis queries into here (getLeaderboard)
  - put websocket stuff in here. probably cant put the whole thing (connect would need to server more than just leaderboard service for example)
- [ ] svelte page refactor
  - make table seperate component
  - make logs seperate component?
  - make input seperate component?
  - seperate file for fetch call? 
    - +page.ts with load functino? https://kit.svelte.dev/docs/routing#page-page-js
    - or onMOunt lifecycle? https://svelte.dev/tutorial/onmount
# BACKLOG
- [ ] do somethign _a little_ more interesting than manually set score
  - gen random score server side on btn click?
- [ ] loading state for table
- [ ] xterm for logs?
  - figure out if logs are useful first
- [ ] add timsetamp to sorted set records
  - https://redis.com/redis-best-practices/time-series/sorted-set-time-series/
  - do I have the score/value correct (user/score)?
- [ ] handle/display errors returned from server on form submit
- [ ] explore if notifications can be setup at redis level
  - https://redis.io/docs/manual/keyspace-notifications/

# DONE
- [X] established ws connection from client to server
- [X] write to redis sortedset (leaderboard) via websocket connection
- [X] read from redis sortedset on change
- [X] fix svelte ts issue
- [X] send top 10 results in WS when leaderboard changes
  - JSON.stringify? alternatives?
- [X] display top 10 in table
- [X] connect to ws automatically (no connect button in svelte)
  -  fix "Websocket is not defined" in svelte. happening in SSR? 
    - fixed by puttin in onMount lifecycle
- [X] refactor server
  - [X] use dependency injection 
    - https://www.npmjs.com/package/typedi
    - https://docs.typestack.community/typedi/01-getting-started
    - https://blog.logrocket.com/dependency-injection-node-js-typedi/
    OR
    - https://www.npmjs.com/package/inversify

# may be a good read on web sockets
https://stackoverflow.com/questions/71246576/websocket-endpoints-and-express-router
https://www.npmjs.com/package/koa-websocket

# guide to bootstrap project
https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/

# redis sorted set - core ds
https://redis.io/docs/data-types/sorted-sets/#:~:text=A%20Redis%20sorted%20set%20is,Leaderboards.

# pnpm workspace setup
https://blog.nrwl.io/setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx-bc5d97258a7e#d69f

I think notifications can be setup at redis level (may not need to publish on channel in app)
https://redis.io/docs/manual/keyspace-notifications/

https://stackoverflow.com/questions/35698061/why-node-js-requires-an-upgrade-while-trying-to-run-an-application-on-the-localh