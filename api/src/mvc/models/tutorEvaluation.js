import uuidv4 from 'uuid/v4'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
	{
		uuid: { type: String, required: true, default: uuidv4 },
		user: { type: ObjectId, ref: 'user', required: true },
		position: { type: ObjectId, ref: 'position', required: true },
		year: { type: Number, required: true },
		questions: [ String ],
		// 1: Malo, 2: Regular, 3: Bueno
		answers: [ Number ],
		comment: { type: String },
		code: { type: String },
		detail: [
			{
				cause: String,
				description: String,
				active: { type: Boolean, default: true },
				createdAt: { type: Date, default: Date.now },
				created_by: { type: ObjectId, ref: 'user', default: null }
			}
		],
		institution: { type: ObjectId, ref: 'institution' },
		created_by: { type: ObjectId, ref: 'user', default: null },
		updated_by: { type: ObjectId, ref: 'user', default: null }
	},
	schemaConfig
)

export default mongoose.model('tutorEvaluation', schema)
