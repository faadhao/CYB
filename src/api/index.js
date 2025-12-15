// API 統一管理模組
const API_BASE = process.env.VUE_APP_API

const API = {
  // 使用者相關
  users: {
    register: `${API_BASE}/users/`,
    login: `${API_BASE}/users/login`,
    logout: `${API_BASE}/users/logout`,
    heartbeat: `${API_BASE}/users/heartbeat`,
    edit: `${API_BASE}/users/edit`,
    user: `${API_BASE}/users/user`,
    getById: (id) => `${API_BASE}/users/${id}`
  },

  // 首頁相關
  home: {
    getFile: `${API_BASE}/home/getFile`,
    img: (filename) => `${API_BASE}/home/img/${filename}`,
    base: `${API_BASE}/home/`
  },

  // 演出資訊
  concert: {
    list: `${API_BASE}/concert/concerts`,
    base: `${API_BASE}/concert/`
  },

  // 票券系統
  ticket: {
    list: `${API_BASE}/ticket/tickets`,
    bookTicket: `${API_BASE}/ticket/bookTicket`,
    getById: (id) => `${API_BASE}/ticket/${id}`
  },

  // 留言板
  message: {
    base: `${API_BASE}/message/`,
    list: `${API_BASE}/message/messages`,
    reply: (id) => `${API_BASE}/message/reply/${id}`,
    getById: (id) => `${API_BASE}/message/${id}`
  },

  // 關於我們
  about: {
    base: `${API_BASE}/about/`
  },

  // 成員
  member: {
    about: `${API_BASE}/member/about`,
    file: (filename) => `${API_BASE}/member/file/${filename}`,
    base: `${API_BASE}/member/`
  },

  // 聯絡資訊
  connection: {
    connectUs: `${API_BASE}/connection/connectUs`,
    base: `${API_BASE}/connection/`
  }
}

export default API
