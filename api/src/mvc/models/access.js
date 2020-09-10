import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    // Referencia al socio
    partner: { type: ObjectId, ref: 'partner', required: true },
    // Fecha y hora del registro de entrada
    date: { type: Date, required: true },
    //!DEPRECATED: accompanied: { type: Boolean, default: false },
    // Información sobre la creación del registro
    ip: { type: String, default: null },
    location: { type: Object, default: null },
    entry: { type: Boolean, default: false },
    exit: { type: Boolean, default: false },
    detail: [{ type: String, default: null }],
    active: { type: Boolean, default: true },
    institution: { type: ObjectId, ref: 'institution' },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

export default mongoose.model('access', schema)
