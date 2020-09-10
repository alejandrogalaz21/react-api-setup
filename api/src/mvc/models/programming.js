import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, required: true, default: uuidv4 },
    cycle: { type: ObjectId, ref: 'cycle', required: true },
    group: { type: ObjectId, ref: 'group', required: true },
    schedule: { type: ObjectId, ref: 'schedule', required: true },
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

export default mongoose.model('programming', schema)
