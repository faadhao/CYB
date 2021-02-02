import messageBord from '../models/messagebord.js'

export const create = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
  } else if (!req.session.user.messageAble) {
    res.status(401).send({ success: false, message: '您沒有留言權限，請聯繫管理員' })
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
  }

  try {
    await messageBord.create({
      user: req.session.user.userName,
      userId: req.session.user._id,
      message: req.body.message,
      reply:　""
    })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤'})
    }
  }
}

export const reply = async (req, res) => {
  if (req.session.user === undefined || req.session.user.gender !== 'root') {
    res.status(401).send({ success: false, message: '未登入' })
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
  }
  console.log(req.headers['content-type'])
  try {
    await messageBord.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤'})
    }
  }
}

export const deletee = async (req, res) => {
  if (req.session.user === undefined || req.session.user.gender !== 'root') {
    res.status(401).send({ success: false, message: '未登入' })
  }

  try {
    await messageBord.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤'})
    }
  }
}

export const messages = async (req, res) => {
  try {
    let result = await messageBord.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}
