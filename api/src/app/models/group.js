import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}

const schema = new Schema(
  {
    id: Number,
    uuid: { type: String, default: uuidv4, required: true },
    name: { type: String, required: true, trim: true },
    ageMin: { type: Number, required: true },
    ageMax: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
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
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

schema.virtual('partners', {
  ref: 'partner',
  localField: '_id',
  foreignField: 'group',
  justOne: false
})

export default mongoose.model('group', schema)
