require('dotenv').config()

const { MongoClient } = require("mongodb")
const express = require('express')

const Model = require('./models/Model')

const userRouter = require('./routers/user')
const endpointsRouter = require('./routers/endpoints')
const urlsRouter = require('./routers/urls')
const requestsRouter = require('./routers/requests')

const app = express()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
  next()
})
app.use(require('body-parser').json())

const mongoClient = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true })

mongoClient.connect((err, client) => {
  Model.setDB(client.db('yourfakeapi'))

  app.use(express.static('dist'))

  app.use('/api/user', userRouter)
  app.use('/api/endpoints', endpointsRouter)
  app.use('/api/endpoints/:endpoint_id/urls', urlsRouter)
  app.use('/endpoint/:endpoint_id', requestsRouter)

  app.listen(process.env.PORT || 80)
})