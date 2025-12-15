// 輸入驗證中介軟體
import { body, param, validationResult } from 'express-validator'

// 檢查驗證結果
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg 
    })
  }
  next()
}

// 使用者註冊驗證
export const registerValidation = [
  body('account')
    .trim()
    .isLength({ min: 4, max: 14 })
    .withMessage('帳號需為 4-14 個字')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('帳號只能包含英文、數字和底線'),
  
  body('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('密碼需為 8-32 個字')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密碼需包含大小寫字母和數字'),
  
  body('userName')
    .trim()
    .notEmpty()
    .withMessage('請輸入姓名')
    .isLength({ max: 50 })
    .withMessage('姓名不可超過 50 個字'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'root'])
    .withMessage('性別格式錯誤'),
  
  validate
]

// 使用者登入驗證
export const loginValidation = [
  body('account')
    .trim()
    .notEmpty()
    .withMessage('請輸入帳號'),
  
  body('password')
    .notEmpty()
    .withMessage('請輸入密碼'),
  
  validate
]

// 使用者編輯驗證
export const editUserValidation = [
  body('userName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('姓名不可為空')
    .isLength({ max: 50 })
    .withMessage('姓名不可超過 50 個字'),
  
  body('account')
    .optional()
    .trim()
    .isLength({ min: 4, max: 14 })
    .withMessage('帳號需為 4-14 個字'),
  
  validate
]

// 演出資訊驗證
export const concertValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('請輸入標題')
    .isLength({ max: 100 })
    .withMessage('標題不可超過 100 個字'),
  
  body('time')
    .trim()
    .notEmpty()
    .withMessage('請輸入表演時間'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('請輸入表演地點')
    .isLength({ max: 100 })
    .withMessage('地點不可超過 100 個字'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('說明不可超過 200 個字'),
  
  validate
]

// 票券驗證
export const ticketValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('請輸入票券名稱'),
  
  body('seats')
    .isInt({ min: 1 })
    .withMessage('座位數必須大於 0'),
  
  body('price')
    .isInt({ min: 0 })
    .withMessage('票價必須大於或等於 0'),
  
  body('c_id')
    .notEmpty()
    .withMessage('請選擇演出場次')
    .isMongoId()
    .withMessage('演出 ID 格式錯誤'),
  
  validate
]

// 訂票驗證
export const bookTicketValidation = [
  body('t_id')
    .notEmpty()
    .withMessage('請選擇票券')
    .isMongoId()
    .withMessage('票券 ID 格式錯誤'),
  
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('購票數量需為 1-10 張'),
  
  validate
]

// 留言驗證
export const messageValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('請輸入留言內容')
    .isLength({ min: 1, max: 500 })
    .withMessage('留言需為 1-500 個字'),
  
  validate
]

// 回覆驗證
export const replyValidation = [
  body('reply')
    .trim()
    .notEmpty()
    .withMessage('請輸入回覆內容')
    .isLength({ min: 1, max: 500 })
    .withMessage('回覆需為 1-500 個字'),
  
  validate
]

// 成員驗證
export const memberValidation = [
  body('memberName')
    .trim()
    .notEmpty()
    .withMessage('請輸入成員姓名')
    .isLength({ max: 50 })
    .withMessage('姓名不可超過 50 個字'),
  
  body('aboutMember')
    .trim()
    .notEmpty()
    .withMessage('請輸入成員介紹')
    .isLength({ max: 500 })
    .withMessage('介紹不可超過 500 個字'),
  
  validate
]

// MongoDB ObjectId 驗證
export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID 格式錯誤'),
  
  validate
]
