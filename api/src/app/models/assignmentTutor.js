import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    user: { type: ObjectId, ref: 'user', required: true },
    program: { type: ObjectId, ref: 'program', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    evaluated: { type: Boolean, default: false },
    schedule: [
      {
        classroom: { type: ObjectId, ref: 'classroom', required: true },
        startHour: { type: String, required: true },
        endHour: { type: String, required: true },
        day: {
          type: String,
          enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          required: true
        }
      }
    ],
    cycle: { type: ObjectId, ref: 'cycle', default: null },
    scheduleId: { type: ObjectId, ref: 'schedule', default: null },
    institution: { type: ObjectId, ref: 'institution', required: true },
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

export default mongoose.model('assignmentTutor', schema)
