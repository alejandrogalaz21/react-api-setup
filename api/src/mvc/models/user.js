import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true, toJSON: { virtuals: true } }

const schema = new Schema(
  {
    uuid: { type: String, required: true, default: uuidv4, index: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    genre: { type: String, required: true, enum: ['M', 'F'] },
    phone: { type: Number, required: true },
    thumbnail: { type: ObjectId, ref: 'file', default: null },
    // Authentication
    email: { type: String, index: { unique: true } },
    password: { type: String, required: true },
    permissions: [
      {
        institution: { type: ObjectId, ref: 'institution' },
        permissions: [{ type: ObjectId, ref: 'permissions' }]
      }
    ],
    position: { type: ObjectId, ref: 'position' },
    profile: { type: ObjectId, ref: 'profile' },
    /* Administrador == 0, Usuario == 1, Colaborador == 2 (Can't login) */
    role: { type: Number, default: 1, enum: [0, 1, 2] },
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        created_by: { type: ObjectId, ref: 'user', default: null }
      }
    ],
    institutions: [{ type: ObjectId, ref: 'institution', default: null }],
    changePassword: { type: Boolean, default: true },
    recoverPasswordToken: { type: String, default: null },
    recoverPasswordExpires: { type: Date, default: null },
    active: { type: Boolean, default: true },
    login: { type: Boolean, default: false }
  },
  schemaConfig
)

schema.virtual('fullName').get(function () {
  return this.name + ' ' + this.lastName
})

export default mongoose.model('user', schema)
