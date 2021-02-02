import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ticketsSchema = new Schema(
  {
    t_id: {
      type: mongoose.ObjectId,
      ref: 'concert'
    },
    quantity: {
      type: Number
    },
    paid: Boolean
  }
)

const userSchema = new Schema(
  {
    account: {
      type: String,
      minlength: [4, '帳號需大於 4 個字'],
      maxlength: [14, '帳號需小於 14 個字'],
      unique: true,
      required: '帳號為必填欄位'
    },
    password: {
      type: String,
      required: [true, '密碼為必填欄位']
    },
    userName: {
      type: String,
      required: '請告訴我們您的姓名'
    },
    gender: {
      type: String
    },
    messageAble: {
      type: Boolean
    },
    tickets: {
      type: [ticketsSchema]
    }
  },
  {
    versionKey: false
  }
)

const users = mongoose.model('user', userSchema)

export default users
