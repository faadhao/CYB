// 統一錯誤處理中介軟體

export const errorHandler = (err, req, res, next) => {
  // Mongoose 驗證錯誤
  if (err.name === 'ValidationError') {
    const key = Object.keys(err.errors)[0]
    const message = err.errors[key].message
    return res.status(400).send({ success: false, message })
  }

  // MongoDB 重複鍵錯誤
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).send({ success: false, message: '資料已存在' })
  }

  // Mongoose CastError (無效的 ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).send({ success: false, message: '無效的 ID 格式' })
  }

  // 自定義錯誤
  if (err.statusCode) {
    return res.status(err.statusCode).send({ 
      success: false, 
      message: err.message 
    })
  }

  // 開發環境顯示詳細錯誤，生產環境隱藏
  console.error('Error:', err)
  
  const message = process.env.DEV === 'true' 
    ? err.message 
    : '伺服器錯誤'
  
  res.status(500).send({ success: false, message })
}

// 404 處理
export const notFound = (req, res) => {
  res.status(404).send({ success: false, message: '找不到該路徑' })
}

// 自定義錯誤類別
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
