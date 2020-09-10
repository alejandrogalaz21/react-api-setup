import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    // FILE DATA
    link: String,
    path: String,
    filename: String,
    extension: String,
    encoding: String,
    mimetype: String,
    size: String,
    // FILE METADATA
    name: String,
    description: String,
    title: String,
    shortDesc: String,
    // FILE RELATIONSHIPS
    created_by: { type: ObjectId, ref: 'user' },
    updated_by: { type: ObjectId, ref: 'user' }
  },
  schemaConfig
)

export default mongoose.model('file', schema)
