# 後端專案優化完成說明

## ✅ 已完成的優化項目

### 1. 安全性改善

#### 🔐 密碼加密升級
- **從 MD5 改為 bcrypt**
  - MD5 已不安全，bcrypt 提供更強的加密保護
  - 自動處理鹽值（salt）生成
  - 防止暴力破解和彩虹表攻擊

#### 🔑 Session Secret 安全化
- **移至環境變數**
  - 不再硬編碼在程式碼中
  - 在 `.env` 文件中設定 `SESSION_SECRET`
  - 每個環境使用不同的密鑰

#### 🚫 速率限制
- **全域限制**: 每 15 分鐘最多 100 次請求
- **登入限制**: 每 15 分鐘最多 5 次登入嘗試
- 防止 DDoS 攻擊和暴力破解

#### 🌐 CORS 設定強化
- **開發模式**: 允許所有來源（方便測試）
- **生產模式**: 使用白名單機制
- 在環境變數中設定允許的來源 `ALLOWED_ORIGINS`

---

### 2. 中介軟體系統

#### ⚠️ 錯誤處理中介軟體
**文件**: `middleware/errorHandler.js`

統一處理所有錯誤：
- Mongoose 驗證錯誤
- MongoDB 重複鍵錯誤
- CastError（無效的 ID）
- 自定義錯誤
- 開發/生產環境區分

#### 🔐 權限驗證中介軟體
**文件**: `middleware/auth.js`

提供四個驗證函數：
- `requireAuth` - 檢查是否已登入
- `requireAdmin` - 檢查是否為管理員
- `requireMessagePermission` - 檢查留言權限
- `requireJSON` - 檢查 Content-Type

#### ✅ 輸入驗證中介軟體
**文件**: `middleware/validation.js`

提供完整的輸入驗證：
- 註冊驗證（帳號、密碼強度、姓名）
- 登入驗證
- 演出資訊驗證
- 票券驗證
- 留言驗證
- MongoDB ObjectId 驗證

**密碼規則強化**：
- 長度：8-32 字（原本 6-16 字）
- 必須包含大小寫字母和數字
- 帳號只能包含英文、數字、底線

---

### 3. 日誌系統

#### 📝 HTTP 請求日誌
使用 **morgan** 記錄所有 HTTP 請求：
- 開發模式：詳細的 `dev` 格式
- 生產模式：標準的 `combined` 格式

---

## 📦 新增的依賴

更新 `package.json` 加入以下套件：

```json
{
  "bcrypt": "^5.1.1",              // 密碼加密
  "express-rate-limit": "^7.1.5",  // 速率限制
  "express-validator": "^7.0.1",   // 輸入驗證
  "winston": "^3.11.0",            // 日誌系統
  "morgan": "^1.10.0",             // HTTP 日誌
  "axios": "^1.6.0"                // 升級版本
}
```

**移除的依賴**：
- `md5` - 已被 bcrypt 取代

---

## 🚀 安裝與啟動

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
複製 `.env.example` 為 `.env` 並填入實際值：

```bash
cp .env.example .env
```

編輯 `.env` 文件：
```env
# MongoDB 連線字串
DBURL=mongodb://localhost:27017/cyb

# 伺服器端口
PORT=3000

# 開發/生產模式
DEV=true

# Session 密鑰（請使用強隨機字串！）
SESSION_SECRET=your-super-secret-key-here-change-this

# 允許的來源（生產環境）
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

⚠️ **重要**：`SESSION_SECRET` 必須使用強隨機字串！

生成安全的密鑰：
```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用 openssl
openssl rand -hex 32
```

### 3. 啟動伺服器
```bash
# 開發模式（使用 nodemon）
npm run dev

# 生產模式
npm start
```

---

## 🔄 資料庫遷移注意事項

### ⚠️ 密碼加密方式改變

由於從 MD5 改為 bcrypt，**現有使用者無法登入**！

#### 解決方案選項：

**選項 1：清空使用者資料（僅開發環境）**
```javascript
// 在 MongoDB 中執行
db.users.deleteMany({})
```

**選項 2：遷移腳本（生產環境）**
創建 `scripts/migrate-passwords.js`：
```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import users from './models/users.js'
import dotenv from 'dotenv'

dotenv.config()

async function migratePasswords() {
  await mongoose.connect(process.env.DBURL)
  
  const allUsers = await users.find()
  
  for (const user of allUsers) {
    // 為所有使用者設定臨時密碼
    const tempPassword = 'Temp@1234'
    user.password = await bcrypt.hash(tempPassword, 10)
    await user.save()
    console.log(`更新使用者: ${user.account}`)
  }
  
  console.log('遷移完成！請通知所有使用者使用臨時密碼登入並更改密碼。')
  process.exit(0)
}

migratePasswords()
```

執行遷移：
```bash
node scripts/migrate-passwords.js
```

**選項 3：重置密碼功能**
建議實作「忘記密碼」功能，讓使用者透過 Email 重置密碼。

---

## 📝 程式碼改進說明

### 改進前 vs 改進後

#### 1. 密碼處理
```javascript
// ❌ 改進前（不安全）
import md5 from 'md5'
password: md5(req.body.password)

// ✅ 改進後（安全）
import bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(req.body.password, 10)
```

#### 2. 錯誤處理
```javascript
// ❌ 改進前（重複代碼）
try {
  // ...
} catch (error) {
  if (error.name === 'ValidationError') {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400).send({ success: false, message })
  } else {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// ✅ 改進後（統一處理）
try {
  // ...
} catch (error) {
  next(error)  // 交給錯誤處理中介軟體
}
```

#### 3. 權限驗證
```javascript
// ❌ 改進前（每個 controller 都檢查）
export const edit = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  // ...
}

// ✅ 改進後（使用中介軟體）
// routes/users.js
router.patch('/edit', requireAuth, edit)
```

#### 4. 輸入驗證
```javascript
// ❌ 改進前（分散且不完整）
if (req.body.password.length < 6) {
  res.status(400).send({ success: false, message: '密碼長度需大於 6 個字' })
}

// ✅ 改進後（集中且完整）
// middleware/validation.js
export const registerValidation = [
  body('password')
    .isLength({ min: 8, max: 32 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密碼需為 8-32 字，且包含大小寫字母和數字'),
  validate
]
```

---

## 🧪 測試建議

### 1. 測試註冊功能
```bash
# 有效的密碼（包含大小寫和數字）
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "account": "testuser",
    "password": "Test@1234",
    "userName": "測試使用者"
  }'

# 無效的密碼（太短）
curl -X POST http://localhost:3000/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "account": "testuser",
    "password": "test",
    "userName": "測試使用者"
  }'
```

### 2. 測試登入速率限制
```bash
# 連續嘗試登入超過 5 次
for i in {1..6}; do
  curl -X POST http://localhost:3000/users/login \
    -H "Content-Type: application/json" \
    -d '{"account": "test", "password": "wrong"}'
  echo "\n第 $i 次嘗試"
done
```

### 3. 測試權限驗證
```bash
# 未登入時嘗試訪問受保護的路由
curl -X GET http://localhost:3000/users/user
# 應回傳 401 Unauthorized
```

---

## 📊 效能影響

### bcrypt vs MD5
- **bcrypt 比 MD5 慢**（這是故意的！）
- 慢速哈希防止暴力破解
- 對正常使用者影響微乎其微（~100ms）
- 大幅提升安全性

### 速率限制
- 記憶體使用增加極少
- 有效防止濫用
- 不影響正常使用者

---

## 🔍 監控與除錯

### 查看日誌
```bash
# 開發模式會在 console 顯示詳細日誌
npm run dev

# 生產模式日誌較簡潔
npm start
```

### 常見錯誤排查

#### 1. "MongoDB 連線失敗"
- 檢查 `DBURL` 是否正確
- 確認 MongoDB 服務是否啟動
- 檢查網路連線

#### 2. "SESSION_SECRET is not defined"
- 確認 `.env` 文件存在
- 檢查環境變數是否正確載入
- 重新啟動伺服器

#### 3. "Not allowed by CORS"
- 檢查 `ALLOWED_ORIGINS` 設定
- 確認前端網域是否在白名單中
- 開發模式設定 `DEV=true`

---

### 中期（建議實作）
- ⏳ 完善 API 文檔（Swagger）
- ⏳ 單元測試
- ⏳ 票券庫存交易
- ⏳ 圖片上傳驗證
- ⏳ 忘記密碼功能

### 長期（考慮升級）
- 🔮 TypeScript 遷移
- 🔮 JWT Token 認證
- 🔮 Redis 快取
- 🔮 資料庫索引優化
- 🔮 Docker 容器化

---

## 🆘 需要幫助？

如果遇到問題：
1. 檢查 `.env` 文件是否正確設定
2. 確認所有依賴已安裝 `npm install`
3. 查看 console 日誌了解錯誤訊息
4. 確認 MongoDB 連線正常

---

## 📚 相關文檔

- [bcrypt 文檔](https://www.npmjs.com/package/bcrypt)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://express-validator.github.io/docs/)
- [Morgan 日誌](https://www.npmjs.com/package/morgan)

---

**優化完成時間**: 2025年12月15日  
**優化項目**: 安全性、中介軟體、輸入驗證、日誌系統
