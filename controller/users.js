import md5 from 'md5'
import users from '../models/users.js'

export const create = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }

  try {
    if (req.body.password.length < 6) {
      res.status(400).send({ success: false,message: '密碼長度需大於 6 個字' })
    } else if (req.body.password.length > 16) {
      res.status(400).send({ success: false, message: '密碼長度需小於 16 個字' })
    } else {
      await users.create({
        account: req.body.account,
        password: md5(req.body.password),
        userName: req.body.userName,
        gender: req.body.gender || "",
        messageAble: true
      })
      res.status(200).send({ success: true, message: '' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false,message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已使用' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }

  try {
    const result = await users.find({
      account: req.body.account,
      password: md5(req.body.password)
    }, '-password')

    if (result.length === 0) {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    } else {
      req.session.user = result[0]
      res.status(200).send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const logout = async (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      res.clearCookie()
      res.status(200).send({ success: true, message: '' })
    }
  })
}

export const heartbeat = async (req, res) => {
  let isLogin = false
  if (req.session.user !== undefined) {
    isLogin = true
  }
  res.status(200).send(isLogin)
}

export const user = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
  }

  try {
    let result = await users.findById(req.session.user._id, '-password').populate('tickets.t_id')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const edit = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }

  try {
    await users.findByIdAndUpdate(req.session.user._id, req.body, { new: true })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const bookTicket = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }

  try {
    await users.findByIdAndUpdate(req.session.user._id,
      {
        $push: {
          tickets: [
            {
              t_id: req.body.t_id,
              quantity: req.body.quantity,
              paid: false
            }
          ]
        }
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const mute = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
  }

  try {
    await users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const findUser = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
  }

  try {
    let result = await users.findById(req.params.id, '-password, -tickets')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const sold = async (req, res) => {
  try {
    let datas = await users.find()
    let result = []
    let id = req.params.id
    datas.map(data => {
      if (data.tickets.length > 0) {
        data.tickets.map(ticket => {
          if (ticket.t_id == id) {
            result.push({
              uid: data._id,
              name: data.userName,
              quantity: ticket.quantity,
              paid: ticket.paid
            })
          }
        })
      }
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
