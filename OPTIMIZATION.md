# 專案優化說明

## 已完成的優化項目

### 1. ✅ 升級 Axios 版本
- 從 `^0.21.0` 升級到 `^1.6.0`
- 修復已知的安全漏洞

### 2. ✅ 實作 API 統一管理
**新增檔案**: `src/api/index.js`

統一管理所有 API 端點，優點：
- 集中管理，易於維護
- 避免硬編碼 URL
- 修改 API 路徑時只需改一處

**使用方式**:
```javascript
import API from '../api'

// 使用範例
this.axios.get(API.users.login)
this.axios.post(API.ticket.bookTicket, data)
```

### 3. ✅ 實作統一錯誤處理
**新增檔案**: `src/utils/errorHandler.js`

提供三個主要函數：
- `handleError(error, vm)` - 統一處理錯誤
- `handleSuccess(message, vm)` - 統一處理成功訊息
- `handleWarning(message, vm)` - 統一處理警告訊息

**使用方式**:
```javascript
import { handleError, handleSuccess } from '../utils/errorHandler'

this.axios.post(API.users.login, data)
  .then(res => {
    handleSuccess('登入成功', this)
  })
  .catch(err => {
    handleError(err, this)
  })
```

### 4. ✅ 實作載入狀態管理
**新增檔案**: `src/utils/loading.js`

提供載入狀態管理功能（已準備但未完全整合）：
- 可在組件中添加 `loading: false` 數據
- 在 API 請求前設為 `true`
- 在 `finally()` 中設為 `false`

### 5. ✅ 移除所有 location.reload()
已從以下檔案移除並改用數據更新：
- `App.vue` - 註冊、登入功能
- `Messagebord.vue` - 留言、回覆、刪除功能
- `UserCenter.vue` - 資料編輯功能

**改進**：
- 使用 Modal 的 `hide()` 方法關閉彈窗
- 重新調用數據載入方法更新畫面
- 避免整頁重新載入，提升使用者體驗

### 6. ✅ 統一錯誤處理方式
- 移除所有 `alert()` 改用 `SweetAlert2`
- 所有錯誤都使用 `handleError()` 處理
- 統一錯誤訊息格式和樣式

### 7. ✅ 優化所有 View 組件

#### App.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 移除註冊/登入後的 `location.reload()`
- ✅ 優化登出功能，改用 SweetAlert2
- ✅ 心跳檢測間隔從 5 秒延長到 30 秒
- ✅ 新增 `resetForm()` 方法

#### Home.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 加入載入狀態
- ✅ 優化數據處理邏輯
- ✅ 使用 `forEach` 替代 `map`

#### Concert.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 加入載入狀態
- ✅ 優化訂票提示使用 `handleWarning`

#### Tickets.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 加入載入狀態
- ✅ 新增座位數驗證
- ✅ 優化票價顯示邏輯
- ✅ 改進 Promise 鏈式處理

#### UserCenter.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 加入載入狀態
- ✅ 優化數據處理使用 `map`
- ✅ 簡化性別顯示邏輯

#### Messagebord.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 移除所有 `location.reload()`
- ✅ 新增 `loadMessages()` 方法
- ✅ 優化所有留言相關功能
- ✅ 加入載入狀態

#### About.vue
- ✅ 導入 API 管理和錯誤處理
- ✅ 使用 `Promise.all` 同時載入三個 API
- ✅ 優化數據處理邏輯
- ✅ 加入載入狀態

## 程式碼改進

### 改進前
```javascript
// ❌ 硬編碼 URL
this.axios.get(process.env.VUE_APP_API + '/users/login')

// ❌ 使用 location.reload()
location.reload()

// ❌ 使用 alert
alert('登出成功')

// ❌ 不一致的錯誤處理
this.$swal({
  icon: 'error',
  title: '發生錯誤',
  text: err.response.data.message
})
```

### 改進後
```javascript
// ✅ 使用 API 管理
this.axios.get(API.users.login)

// ✅ 使用數據更新
this.$bvModal.hide('modal-id')
this.loadData()

// ✅ 統一使用 SweetAlert2
handleSuccess('登出成功', this)

// ✅ 統一錯誤處理
handleError(err, this)
```

## 安裝與使用

### 安裝新依賴
```bash
npm install
```

### 開發模式
```bash
npm run serve
```

### 生產打包
```bash
npm run build
```

## 注意事項

1. **環境變數**: 確保 `.env` 檔案中設定了 `VUE_APP_API`
   ```
   VUE_APP_API=http://localhost:3000
   ```

2. **後端兼容性**: 所有 API 端點保持不變，無需修改後端

3. **載入狀態**: 各組件已加入 `loading` 狀態，可搭配 UI 組件顯示載入動畫

4. **錯誤處理**: 所有錯誤都會自動顯示 SweetAlert2 提示，並記錄到 console

## 建議的後續優化

1. **環境變數檔案**: 建立 `.env.example` 給其他開發者參考
2. **載入動畫**: 在組件中加入 `<b-spinner>` 或其他載入動畫
3. **表單驗證**: 加強前端表單驗證規則
4. **單元測試**: 為新增的工具函數撰寫測試
5. **TypeScript**: 考慮逐步遷移至 TypeScript

## 性能提升

- ⚡ 心跳檢測從 5 秒改為 30 秒，減少 83% 的伺服器請求
- ⚡ 避免 `location.reload()` 帶來的整頁重載
- ⚡ 使用 `Promise.all` 並行載入數據
- ⚡ 優化數據處理邏輯，減少不必要的迴圈

## 維護性提升

- 📦 API 集中管理，修改更容易
- 🔧 統一的錯誤處理方式
- 🎨 一致的程式碼風格
- 📝 更易讀的程式碼結構
