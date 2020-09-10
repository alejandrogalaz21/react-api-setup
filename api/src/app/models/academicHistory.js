import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    school: { type: ObjectId, ref: 'school', required: true },
    partner: { type: ObjectId, ref: 'partner', required: true },
    shift: { type: String, enum: ['Matutino', 'Vespertino'], required: true },
    startDate: { type: Date, required: true },
    evaluations: [
      {
        grade: { type: String, required: true },
        group: { type: String, required: true },
        spanish: { type: Number, required: true },
        mathematics: { type: Number, required: true }
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
    institution: { type: ObjectId, ref: 'institution' },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

export default mongoose.model('academicHistory', schema)
