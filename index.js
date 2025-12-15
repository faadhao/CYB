import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo'
import cors from 'cors'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { errorHandler, notFound } from './middleware/errorHandler.js'

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
  .then(() => console.log('MongoDB 連線成功'))
  .catch(err => {
    console.error('MongoDB 連線失敗:', err)
    process.exit(1)
  })

const app = express()

// 日誌中介軟體
app.use(morgan(process.env.DEV === 'true' ? 'dev' : 'combined'))

app.use(bodyParser.json())

// 全域速率限制：每 15 分鐘最多 100 次請求
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: '請求過於頻繁，請稍後再試' },
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

// 強化 CORS 設定
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8080']

app.use(cors({
  origin (origin, callback) {
    // 允許沒有 origin 的請求（如 Postman、伺服器間請求）
    if (!origin) {
      return callback(null, true)
    }
    
    // 開發模式允許所有來源
    if (process.env.DEV === 'true') {
      return callback(null, true)
    }
    
    // 生產模式使用白名單
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true
}))

const MongoStore = connectMongo(session)

const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'default-secret-please-change',
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

// 登入路由的嚴格速率限制：每 15 分鐘最多 5 次
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: '登入嘗試次數過多，請 15 分鐘後再試' },
  skipSuccessfulRequests: true
})

app.use('/users', routerUsers)
app.use('/about', routerAbout)
app.use('/member', routerMember)
app.use('/connection', routerConnection)
app.use('/concert', routerConcert)
app.use('/ticket', routerTicket)
app.use('/message', routerMessage)
app.use('/home', routerHome)

// 404 處理
app.use(notFound)

// 統一錯誤處理
app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`伺服器已啟動在 port ${process.env.PORT}`)
  console.log(`環境模式: ${process.env.DEV === 'true' ? '開發' : '生產'}`)
})

// 匯出 loginLimiter 供 routes 使用
export { loginLimiter }
