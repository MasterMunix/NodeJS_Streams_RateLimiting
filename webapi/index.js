import * as dotenv from 'dotenv'
dotenv.config()

import express from "express"
import bodyParser from "body-parser"
import { createWriteStream } from 'node:fs'
import rateLimit from 'express-rate-limit'

//limit the usage of an API
let max_limit = process.env.MAX_LIMIT

const limiter = rateLimit({
    windowMs: 1000,// 1 sec
    max: max_limit,// Limit each IP to 10 requests per `window` (here, per 1 sec)
    standardHeaders: true,// Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,// Disable the `X-RateLimit-*` headers
})

const app = express()

app.use(bodyParser.json())
app.use(limiter) //To use it in an specific api use it as middleware

const PORT = process.env.PORT
const output = createWriteStream('output.ndjson')

app.post('/', async (req, res) => {
    output.write(JSON.stringify(req.body) + "\n")
    return res.send(req.body)
});

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
});

