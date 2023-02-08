# Local Development
Start a redis server

    docker run -it -d --rm --name redis-server -p 6379:6379 redis

Access redis server directly:

    docker exec -it redis-server bash
    redis-cli