import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo'
import cors from 'cors'
import session from 'express-session'

import routerUsers from './routes/users.js'
import routerAbout from './routes/about.js'
import routerMember from './routes/member.js'
import routerConnection from './routes/connection.js'
import routerConcert from './routes/concert.js'
import routerTicket from './routes/ticket.js'
import routerMessage from './routes/messagebord.js';
import routerHome from './routes/home.js'

dotenv.config()

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

app.use(bodyParser.json())

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.DEV === 'true') {
        callback(null, true)
      } else if (origin.includes('github')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed'), false)
      }
    }
  },
  credentials: true
}))

const MongoStore = connectMongo(session)

const sessionSettings = {
  secret: 'wdaalbum',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  saveUninitialized: false,
  rolling: true,
  resave: true
}

if (process.env.DEV === 'false') {
  sessionSettings.cookie.sameSite = 'none'
  sessionSettings.cookie.secure = true
}

app.use(session(sessionSettings))

app.set('trust proxy', 1)

app.use('/users', routerUsers)
app.use('/about', routerAbout)
app.use('/member', routerMember)
app.use('/connection', routerConnection)
app.use('/concert', routerConcert)
app.use('/ticket', routerTicket)
app.use('/message', routerMessage)
app.use('/home', routerHome)

app.use((_, req, res, next) => {
  res.status(500).send({ success: false, message: '伺服器錯誤' })
})

app.listen(process.env.PORT, () => {
  console.log('server started')
})
