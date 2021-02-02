import multer from 'multer'
import FTPStorage from 'multer-ftp'
import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

import member from '../models/member.js'

let storage

if (process.env.DEV === 'true') {
  storage = multer.diskStorage({
    destination (req, file, callback) {
      callback(null, 'images/')
    },
    filename (req, file, callback) {
      callback(null, Date.now() + path.extname(file.originalname))
    }
  })
} else {
  storage = new FTPStorage({
    ftp: {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false
    },
    destination(req, file, option, callback) {
      callback(null, '/' + Date.now() + path.extname(file.originalname))
    }
  })
}

const upload = multer({
  storage,
  fileFilter (req, file, callback) {
    if (!file.mimetype.includes('image')) {
      callback(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

export const create = async(req, res) => {
  if (req.session.user === undefined || req.session.user.account !== 'root') {
    res.status(401).send({ success: false, message: '未登入或沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }

  upload.single('image')(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案過大'
      } else if (error.code === 'LIMIT_FORMAT') {
        message = '格式不符'
      } else {
        message = '上傳錯誤'
      }
      console.log(error)
      res.status(400).send({success: false, message})
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let file = ''
        if (process.env.DEV === 'true') {
          file = req.file.filename
        } else {
          file = path.basename(req.file.path)
        }
        const result = await member.create({
          memberName: req.body.memberName,
          aboutMember: req.body.aboutMember,
          file
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
  })
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
    let result = await member.findById(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      result = await member.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.status(200).send({ success: true, message: '', result})
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
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
    let result = await member.findById(req.params.id)
    if (result === null) {
      res.status(404).send({success: false, message: '找不到檔案'})
    } else {
      result = await member.findByIdAndDelete(req.params.id)
      res.status(200).send({ success: true, message: ''})
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

export const file = async (req, res) => {
  if (process.env.DEV === 'true') {
    const path = process.cwd() + '/images/' + req.params.file
    const exists = fs.existsSync(path)

    if (exists) {
      res.status(200).sendfile(path)
    } else {
      res.status(404).send({ success: false, message: '找不到圖片'})
    }
  } else {
    axios({
      method: 'GET',
      url: 'http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.file,
      responseType: 'stream'
    }).then(ress => {
      ress.data.pipe(res)
    }).catch(error => {
      res.status(error.response.status).send({ success: false, message: '取得圖片失敗'})
    })
  }
}

export const about = async (req, res) => {
  try {
    const result = await member.find()
    res.status(200).send({ success: true, message: '',result})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}
