import express from 'express'
import { create, login, logout, heartbeat, user, edit, mute, findUser, sold } from '../controller/users.js'
import { requireAuth, requireAdmin, requireJSON } from '../middleware/auth.js'
import { registerValidation, loginValidation, editUserValidation, mongoIdValidation } from '../middleware/validation.js'
import { loginLimiter } from '../index.js'

const router = express.Router()

// 註冊 - 需要 JSON 格式和輸入驗證
router.post('/', requireJSON, registerValidation, create)

// 登入 - 需要速率限制、JSON 格式和輸入驗證
router.post('/login', loginLimiter, requireJSON, loginValidation, login)

// 編輯使用者資料 - 需要登入、JSON 格式和輸入驗證
router.patch('/edit', requireAuth, requireJSON, editUserValidation, edit)

// 禁言使用者 - 需要管理員權限、JSON 格式和 ID 驗證
router.patch('/:id', requireAdmin, requireJSON, mongoIdValidation, mute)

// 登出 - 需要登入
router.delete('/logout', requireAuth, logout)

// 心跳檢測 - 公開
router.get('/heartbeat', heartbeat)

// 獲取當前使用者資料 - 需要登入
router.get('/user', requireAuth, user)

// 查詢售出票券 - 需要管理員權限和 ID 驗證
router.get('/sold/:id', requireAdmin, mongoIdValidation, sold)

// 查詢特定使用者 - 需要登入和 ID 驗證
router.get('/find/:id', requireAuth, mongoIdValidation, findUser)

export default router
