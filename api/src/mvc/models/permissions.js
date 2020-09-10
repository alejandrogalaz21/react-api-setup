import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    module: { type: ObjectId, ref: 'modules', required: true },
    user: { type: ObjectId, ref: 'user', required: true },
    create: { type: Boolean, default: false }, // post
    read: { type: Boolean, default: false }, // get
    update: { type: Boolean, default: false }, // put
    delete: { type: Boolean, default: false }, // delete,
    institution: { type: ObjectId, ref: 'institution' }
  },
  schemaConfig
)

export default mongoose.model('permissions', schema)
