import mongoose from 'mongoose'

const Schema = mongoose.Schema

const messageBordSchema = new Schema(
  {
    user: {
      type: String,
      required: [true, '缺少使用者欄位']
    },
    message: {
      type: String,
      required: [true, '請留言']
    },
    reply: {
      type: String
    },
    userId: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

const messageBord = mongoose.model('messageBord', messageBordSchema)

export default messageBord
