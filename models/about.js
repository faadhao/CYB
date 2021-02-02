import mongoose from 'mongoose'

const Schema = mongoose.Schema

const aboutSchema = new Schema(
  {
    about: {
      type: String,
      required: [true, '請輸入介紹']
    }
  },
  {
    versionKey: false
  }
)

const about = mongoose.model('about', aboutSchema)

export default about
