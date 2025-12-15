// 統一錯誤處理工具
export const handleError = (error, vm) => {
  let title = '發生錯誤'
  let text = '請稍後再試'

  if (error.response) {
    // 伺服器回應錯誤
    text = error.response.data.message || error.response.statusText || text
    
    // 根據狀態碼處理
    switch (error.response.status) {
      case 400:
        title = '請求錯誤'
        break
      case 401:
        title = '未授權'
        text = '請重新登入'
        break
      case 403:
        title = '禁止訪問'
        break
      case 404:
        title = '找不到資源'
        break
      case 500:
        title = '伺服器錯誤'
        break
    }
  } else if (error.request) {
    // 請求已發送但沒有收到回應
    title = '網路錯誤'
    text = '無法連接到伺服器，請檢查網路連線'
  } else {
    // 其他錯誤
    text = error.message || text
  }

  // 使用 SweetAlert2 顯示錯誤
  if (vm && vm.$swal) {
    vm.$swal({
      icon: 'error',
      title,
      text
    })
  }

  // 記錄錯誤到 console 以便調試
  console.error('Error:', error)

  return { title, text }
}

// 統一成功訊息處理
export const handleSuccess = (message, vm) => {
  if (vm && vm.$swal) {
    vm.$swal({
      icon: 'success',
      title: '成功',
      text: message
    })
  }
}

// 統一警告訊息處理
export const handleWarning = (message, vm) => {
  if (vm && vm.$swal) {
    vm.$swal({
      icon: 'warning',
      title: '注意',
      text: message
    })
  }
}

export default {
  handleError,
  handleSuccess,
  handleWarning
}
