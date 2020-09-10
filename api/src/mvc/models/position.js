import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
}

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4 },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: [{ type: ObjectId, ref: 'user', default: null }],
    questionnaire: [
      {
        question: { type: String, required: true, trim: true }
      }
    ],
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

schema.virtual('users', {
  ref: 'user', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'position', // is equal to `foreignField`
  justOne: false
})

export default mongoose.model('position', schema)
