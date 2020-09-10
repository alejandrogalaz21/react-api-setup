import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    id: Number,
    uuid: { type: String, default: uuidv4, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, required: true },
    hour: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Paseo', 'Evento'],
      required: true
    },
    place: {
      address: { type: String, required: true, trim: true },
      lat: { type: Number },
      lng: { type: Number }
    },
    entries: [
      {
        partner: { type: ObjectId, ref: 'partner' },
        date: { type: Date, default: Date.now }
      }
    ],
    exits: [
      {
        partner: { type: ObjectId, ref: 'partner' },
        date: { type: Date, default: Date.now }
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

export default mongoose.model('event', schema)
