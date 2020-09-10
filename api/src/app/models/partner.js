import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true, toJSON: { virtuals: true } }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Socio', 'Visitante'] },
    address: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    },
    institution: { type: ObjectId, ref: 'institution' },
    genre: { type: String, required: true, enum: ['Hombre', 'Mujer'] },
    school: { type: ObjectId, ref: 'school', required: true },
    access: [{ type: ObjectId, ref: 'access', default: null }],
    security: { type: ObjectId, ref: 'partnerSecurity' },
    family: [{ type: ObjectId, ref: 'partnerParent' }],
    birthDate: { type: Date, required: true },
    startDate: { type: Date },
    foodProgram: { type: Boolean, default: false },
    height: { type: Number },
    weight: { type: Number },
    sleep: { type: Number },
    activities: { type: String },
    feedingHabits: { type: String },
    group: {
      type: ObjectId,
      ref: 'group',
      default: null,
      required: function() {
        return this.category === 'Socio'
      }
    },
    id: {
      type: String,
      default: null,
      required: function() {
        return this.category === 'Socio'
      }
    },
    enrollment: {
      type: Number,
      default: null,
      required: function() {
        return this.category === 'Socio'
      }
    },
    thumbnail: { type: ObjectId, ref: 'file', default: null },
    shift: { type: String, enum: ['Matutino', 'Vespertino'] },
    attendance: { type: Number, default: 0 },
    // configuration
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        created_by: { type: ObjectId, ref: 'user', default: null }
      }
    ],
    historical: [
      {
        // store status changes
        date: { type: Date, default: Date.now },
        dropout: { type: ObjectId, ref: 'dropout', default: null },
        change: {
          type: String,
          enum: ['Ingreso', 'Baja', 'Activo', 'Egreso'],
          required: true
        },
        description: { type: String, required: true },
        created_by: { type: ObjectId, ref: 'user' }
      }
    ],
    status: { type: Number, default: 0, enum: [0, 1, 2, 3] },
    active: { type: Boolean, default: true },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

// 'status' valid states:
// 0 = Nuevo: hasn't assisted the club
// 1 = Activo: has assisted once the club
// 2 = Baja: left the club
// 3 = Egresado: has reached the age limit (final state)

schema.virtual('fullName').get(function() {
  return this.name + ' ' + this.lastName
})

export default mongoose.model('partner', schema)
