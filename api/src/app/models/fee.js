import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    partner: { type: ObjectId, ref: 'partner', required: true },
    concept: {
      type: String,
      enum: ['Mensualidad', 'Alimentos', 'Gafete', 'Paseos', 'Otro'],
      required: true
    },
    discount: { type: Number, enum: [0, 25, 50, 75, 100], default: 0 },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
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

export default mongoose.model('fee', schema)
