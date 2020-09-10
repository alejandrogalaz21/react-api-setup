import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    thumbnail: { type: ObjectId, ref: 'file', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    copies: [
      {
        editorial: { type: String, required: true, trim: true },
        isbn: { type: Number, required: true },
        cant: { type: Number, required: true }
      }
    ],
    author: { type: String, required: true, trim: true },
    category: [{ type: ObjectId, ref: 'category', required: true }],
    bookLocation: { type: ObjectId, ref: 'bookLocation', required: true },
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        created_by: { type: ObjectId, ref: 'user', default: null }
      }
    ],
    active: { type: Boolean, default: true },
    institution: { type: ObjectId, ref: 'institution' },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

export default mongoose.model('book', schema)
