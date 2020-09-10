import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, required: true, default: uuidv4, index: true, unique: true },
    email: { type: String, required: true, trim: true },
    transport: {
      host: { type: String, required: true, trim: true },
      port: { type: Number, default: 587 },
      auth: {
        user: { type: String, required: true, trim: true },
        pass: { type: String, required: true, trim: true }
      }
    },
    active: { type: Boolean, default: true },
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        created_by: { type: ObjectId, ref: 'user', default: null },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    created_by: { type: ObjectId, ref: 'user' },
    updated_by: { type: ObjectId, ref: 'user' },
    deleted_by: { type: ObjectId, ref: 'user' }
  },
  schemaConfig
)

const model = mongoose.model('mailer', schema)
export default model
