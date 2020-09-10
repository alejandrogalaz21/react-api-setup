import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true, toJSON: { virtuals: true } }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    thumbnail: { type: ObjectId, ref: 'file', default: null },
    name: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, required: true },
    genre: { type: String, required: true, enum: ['Hombre', 'Mujer'] },
    email: { type: String, trim: true, required: true },
    phone: { type: Number, required: true },
    position: { type: ObjectId, ref: 'position', required: true },
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

schema.virtual('fullName').get(function () {
  return this.name + ' ' + this.lastName
})

export default mongoose.model('collaborator', schema)
