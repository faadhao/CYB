import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, '缺少演出場次']
    },
    seats: {
      type: Number,
      required: [true, '缺少座位總數']
    },
    price: {
      type: Number,
      required: [true, '缺少票價']
    },
    c_id: {
      type: mongoose.ObjectId,
      ref: 'concert'
    }
  },
  {
    versionKey: false
  }
)

const ticket = mongoose.model('ticket', ticketSchema)

export default ticket
