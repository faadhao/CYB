import connection from '../models/connection.js'

export const create = async (req, res) => {
  if (req.session.user === undefined || req.session.user.account !== 'root') {
    res.status(401).send({ success: false, message: '未登入或沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }

  try {
    await connection.create({
      facebook: req.body.facebook,
      phone: req.body.phone,
      email: req.body.email,
      instagram: req.body.instagram
    })
    res.status(200).send({ success: true, message: ''})
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
  if (req.session.user === undefined || req.session.user.account !== 'root') {
    res.status(401).send({ success: false, message: '未登入或沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }

  try {
    let result = await connection.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ success: true, message: '' })
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

export const connectUs = async (req, res) => {
  try {
    let result = await connection.find()
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
