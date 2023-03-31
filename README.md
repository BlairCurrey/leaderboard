# Purpose

Experimentating with Svelte, websockets, and Redis sorted sets. You submit a number and it gets added to a leaderboard. The top 10 spots of the leaderboard are streamed to clients over websockets. The user submitted number is a proxy for some other value that would be used to create a leaderboard (like a score from a game, or donation amount, etc.)

# Local Development
Start a redis server

    docker run -it -d --rm --name redis-server -p 6379:6379 redis

Access redis server directly:

    docker exec -it redis-server bash
    redis-cli
