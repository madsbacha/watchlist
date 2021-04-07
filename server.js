const express = require('express')
const bodyParser = require('body-parser')
const { createTable } = require('./database')
const api = require('./api')
const client = require('./client')
createTable()
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use("/api", api)
app.use("/", client)
 
app.listen(3000)
