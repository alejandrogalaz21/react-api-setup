import mongoose from 'mongoose'
import { email } from './../../helpers/regex.helper'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = {
  strict: true,
  versionKey: false,
  toJSON: { virtuals: true },
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
}

const schema = new Schema(
  {
    email: {
      desc: "The user's email address.",
      trim: true,
      type: String,
      index: true,
      unique: [true, 'El email debe ser unico'],
      required: [true, 'El email es requerido']
    },
    password: {
      desc: 'user password',
      trim: true,
      type: String,
      required: true,
      select: false
    },
    name: {
      desc: "The user's name.",
      trim: true,
      type: String,
      required: true
    },
    age: {
      desc: "The users's age.",
      type: Number
    },
    gender: {
      desc: 'user gender.',
      trim: true,
      type: String,
      enum: ['Male', 'Female', 'Others'],
      default: 'Others',
      required: true
    },
    isActive: {
      desc: 'is Active.',
      type: Boolean,
      default: true,
      required: true
    },
    userType: {
      desc: 'user roles.',
      trim: true,
      type: String,
      enum: ['Admin', 'User'],
      default: 'Admin',
      required: true
    }
  },
  schemaConfig
)

//schema.virtual('fullName').get(function () {
//  return this.name + ' ' + this.lastName
//})

// validations
schema.path('email').validate(value => {
  if (!email.test(value)) {
    throw new Error('Email no valido')
  }
}, 'email no valido')

export default mongoose.model('user', schema)
