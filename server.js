const express = require('express')
const bodyParser = require('body-parser')
const { createTable } = require('./database')
const api = require('./api')
createTable()
const app = express()

app.use(bodyParser.json())
app.use("/api", api)
 
app.listen(3000)
