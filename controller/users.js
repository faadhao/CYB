import bcrypt from 'bcrypt'
import users from '../models/users.js'

export const create = async (req, res, next) => {
  try {
    // 使用 bcrypt 加密密碼，盤雜輪數 10
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    await users.create({
      account: req.body.account,
      password: hashedPassword,
      userName: req.body.userName,
      gender: req.body.gender || '',
      messageAble: true
    })
    
    res.status(200).send({ success: true, message: '註冊成功' })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    // 查找使用者（包含密碼欄位）
    const user = await users.findOne({ account: req.body.account })

    if (!user) {
      return res.status(401).send({ success: false, message: '帳號或密碼錯誤' })
    }

    // 使用 bcrypt 驗證密碼
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).send({ success: false, message: '帳號或密碼錯誤' })
    }

    // 將使用者資訊儲存到 session（不包含密碼）
    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password
    req.session.user = userWithoutPassword
    
    res.status(200).send({ 
      success: true, 
      message: '登入成功', 
      result: [userWithoutPassword] 
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      return next(error)
    }
    res.clearCookie('connect.sid')
    res.status(200).send({ success: true, message: '登出成功' })
  })
}

export const heartbeat = async (req, res) => {
  let isLogin = false
  if (req.session.user !== undefined) {
    isLogin = true
  }
  res.status(200).send(isLogin)
}

export const user = async (req, res, next) => {
  try {
    const result = await users.findById(req.session.user._id, '-password').populate('tickets.t_id')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    next(error)
    }
  }
}

export const edit = async (req, res, next) => {
  try {
    await users.findByIdAndUpdate(req.session.user._id, req.body, { new: true })
    res.status(200).send({ success: true, message: '更新成功' })
  } catch (error) {
    next(error)
  }
}

export const bookTicket = async (req, res, next) => {
  try {
    await users.findByIdAndUpdate(
      req.session.user._id,
      {
        $push: {
          tickets: {
            t_id: req.body.t_id,
            quantity: req.body.quantity,
            paid: false
          }
        }
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '訂票成功' })
  } catch (error) {
    next(error)
  }
}

export const mute = async (req, res, next) => {
  try {
    await users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ success: true, message: '更新成功' })
  } catch (error) {
    next(error)
  }
}

export const findUser = async (req, res, next) => {
  try {
    const result = await users.findById(req.params.id, '-password -tickets')
    if (!result) {
      return res.status(404).send({ success: false, message: '找不到該使用者' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    next(error)
  }
}

export const sold = async (req, res, next) => {
  try {
    const datas = await users.find()
    const id = req.params.id
    const result = []
    
    datas.forEach(data => {
      if (data.tickets && data.tickets.length > 0) {
        data.tickets.forEach(ticket => {
          if (ticket.t_id.toString() === id) {
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
    next(error)
  }
}
