import mongoose from 'mongoose'

const Schema = mongoose.Schema

const memberSchema = new Schema(
  {
    memberName: {
      type: String,
      required: [true, '缺少團員姓名']
    },
    aboutMember: {
      type: String,
      required: [true, '缺少團員介紹']
    },
    file: {
      type: String,
      required: [true, '缺少檔案名稱']
    }
  },
  {
    versionKey: false
  }
)

const member = mongoose.model('member', memberSchema)

export default member
