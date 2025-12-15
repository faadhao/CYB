// 權限驗證中介軟體

// 檢查是否已登入
export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ success: false, message: '未登入' })
  }
  next()
}

// 檢查是否為管理員
export const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ success: false, message: '未登入' })
  }
  
  if (req.session.user.gender !== 'root') {
    return res.status(403).send({ success: false, message: '沒有權限' })
  }
  
  next()
}

// 檢查留言權限
export const requireMessagePermission = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ success: false, message: '未登入' })
  }
  
  if (!req.session.user.messageAble) {
    return res.status(403).send({ 
      success: false, 
      message: '您沒有留言權限，請聯繫管理員' 
    })
  }
  
  next()
}

// 檢查 Content-Type 是否為 JSON
export const requireJSON = (req, res, next) => {
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).send({ success: false, message: '資料格式錯誤' })
  }
  next()
}
