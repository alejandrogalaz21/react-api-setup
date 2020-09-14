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
    name: {
      desc: "Name",
      trim: true,
      type: String,
      required: [true, 'El nombre es requerido']
    },
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

// check if is unique
schema.path('name').validate(async value => {
  if (await mongoose.models.product.exists({ name: value })) {
    throw new Error('ya existe')
  }
})

export default mongoose.model('product', schema)
