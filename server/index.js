const keys = require('./keys')

// Express app setup
const express = require('express') 
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Postgres client setup
const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('connect', () => {
    pgClient
      .query('CREATE TABLE IF NOT EXISTS values (number INT)')
      .catch((err) => console.log(err));
  });

// Redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // Retry every second
})
const redisPublisher = redisClient.duplicate()

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi there')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values')

    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})

app.post('/values', async (req, res) => {
    const index = req.body.index

    // Larger numbers will take a loooooong time to process, so we preempt them
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high')
    }

    redisClient.hset('values', index, 'Nothing yet')
    redisPublisher.publish('insert', index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    res.send({ working: true })
})

app.listen(5000, err => {
    console.log(`Listening on ${port}`)
})


// FROM node:14.14.0-alpine