import mongoose from 'mongoose'

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
    title: String,
    isActive: {
      desc: 'is Active.',
      type: Boolean,
      default: true,
      required: true
    }
  },
  schemaConfig
)

//schema.virtual('fullName').get(function () {
//  return this.name + ' ' + this.lastName
//})

export default mongoose.model('product', schema)
