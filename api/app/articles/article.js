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
      desc: 'Name',
      trim: true,
      type: String,
      required: [true, 'El nombre es requerido']
    },
    quantity: {
      desc: 'Quantity',
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'El mínimo debe ser 1'],
      max: [100, 'El máximo debe ser 100']
    },
    isActive: {
      desc: 'Is active',
      type: Boolean,
      default: true
    }
  },
  schemaConfig
)

// check if is unique
schema.path('name').validate(async value => {
  if (await mongoose.models.article.exists({ name: value })) {
    throw new Error('Artículo ya existente')
  }
})

export default mongoose.model('article', schema)
