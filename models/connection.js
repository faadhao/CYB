import mongoose from 'mongoose'

const Schema = mongoose.Schema

const connectionSchema = new Schema(
  {
    facebook: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

const connection = mongoose.model('conection', connectionSchema)

export default connection
