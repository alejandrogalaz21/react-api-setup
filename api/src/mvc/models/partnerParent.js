import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true, toJSON: { virtuals: true } }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    partner: { type: ObjectId, ref: 'partner' },
    // Nombre del padre o tutor
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    // Estado civil: 'Soltero', 'Casado', 'Viudo', 'Unión libre', 'Divorciado'
    civilStatus: { type: Number, enum: [0, 1, 2, 3, 4] },
    birthDate: { type: Date, required: true },
    phone: { type: Number, required: true },
    cellphone: { type: Number, required: true },
    // Parentesco: 'Padre', 'Madre', 'Tutor'
    relationship: { type: Number, enum: [0, 1, 2], required: true },
    scholarship: {
      type: String,
      required: true,
      enum: ['Primaria', 'Secundaria', 'Preparatoria', 'Educación superior', 'Ninguno']
    },
    occupation: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    placeBirth: { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true }
  },
  schemaConfig
)

schema.virtual('fullName').get(function () {
  return this.name + ' ' + this.lastName
})

export default mongoose.model('partnerParent', schema)
