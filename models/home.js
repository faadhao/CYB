import mongoose from 'mongoose'

const Schema = mongoose.Schema

const homeSchema = new Schema(
  {
    file: String,
    title: String,
    film: String
  },
  {
    versionKey: false
  }
)

const home = mongoose.model('home', homeSchema)

export default home
