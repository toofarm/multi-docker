const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // If we lose connection to the server, attempt reconnect once every second
})

const sub = redisClient.duplicate()

function fib(i) {
    if (i < 2) return 1
    return fib(i - 1) + fib(i - 2)
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
})

sub.subscribe('insert')

