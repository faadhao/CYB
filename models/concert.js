import mongoose from 'mongoose'

const Schema = mongoose.Schema

const concertSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, '請輸入標題']
    },
    time: {
      type: String,
      required: [true, '請輸入表演時間']
    },
    location: {
      type: String,
      required: [true, '請輸入表演地點']
    },
    description: {
      type: String,
      maxlength: [200, '說明請勿超過 200 個字']
    }
  },
  {
    versionKey: false
  }
)

const concert = mongoose.model('concert', concertSchema)

export default concert
