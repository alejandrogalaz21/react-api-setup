import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    partner: { type: ObjectId, ref: 'partner' },
    group: { type: ObjectId, ref: 'group' },
    cycle: { type: ObjectId, ref: 'cycle' },
    program: { type: ObjectId, ref: 'program' },
    assignmentTutor: { type: ObjectId, ref: 'assignmentTutor' },
    user: { type: ObjectId, ref: 'user' },
    objectives: [String],
    code: { type: String },
    answers: [{ type: Number, enum: [1, 2, 3, 4, 5] }],
    comment: { type: String },
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        created_by: { type: ObjectId, ref: 'user', default: null }
      }
    ],
    institution: { type: ObjectId, ref: 'institution' },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

export default mongoose.model('partnerEvaluation', schema)
