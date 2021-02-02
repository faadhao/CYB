import '../models/concert.js'
import ticket from '../models/ticket.js'

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
    await ticket.create({
      title: req.body.title,
      seats: req.body.seats,
      price: req.body.price,
      c_id: req.body.c_id
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

export const edit = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }

  try {
    await ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
  if (req.session.user === undefined || req.session.user.account !== 'root') {
    res.status(401).send({ success: false, message: '未登入或沒有權限' })
    return
  }

  try {
    await ticket.findOneAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (errpr) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

export const tickets = async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }

  try {
    let result = await ticket.find().populate('c_id')
    res.status(200).send({ success: true, message: '', result})
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

export const getTicket = async (req, res) => {
  try {
    let result = await ticket.findById(req.body.id).populate('c_id')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}
