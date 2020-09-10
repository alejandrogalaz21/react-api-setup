import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }
const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4 },
    partner: { type: ObjectId, ref: 'partner' },
    // Autorizo la toma de fotografías y/o video a mi hijo(a) para fines promocionales del club.
    question1: { type: Boolean, required: true },
    // Yo _____ nombre del menor____ autorizo la toma de fotografías y/o video
    // para fines promocionales del club.
    question2: { type: Boolean, required: true },
    // ¿El menor tiene autorización para salir solo del club?
    question3: { type: Boolean },
    // Personas autorizadas para recoger al menor en caso de no tener autorización de salir solo
    people: [
      {
        name: { type: String, trim: true },
        lastName: { type: String, trim: true },
        phone: Number,
        relationship: String
      }
    ],
    // ¿Padece una enfermedad crónica?
    question4: { type: Boolean, required: true },
    // ¿Cuál?
    question4Specific: String,
    // ¿Está bajo algún tratamiento médico?
    question5: { type: Boolean, required: true },
    // ¿Cuál?
    question5Specific: String,
    // ¿Padece algún tipo de alergia?
    question6: { type: Boolean, required: true },
    // ¿Cuál?
    question6Specific: String,
    // Autorizo al Club para que a mi hijo se le dé "MEDICAMENTO" en el caso de que presente malestares
    // en el horario dentro de este Club, asumiendo la responsabilidad en caso de que tenga alguna
    // reacción secundaria.
    question7: { type: Boolean, required: true },
    // Autorizo para que en caso de algún accidente en donde sea necesario su traslado se le lleve a una
    // Institución de Servicios Médicos (en caso de emergencia se le avisará a los padres de inmediato)
    question8: { type: Boolean, required: true }
  },
  schemaConfig
)

export default mongoose.model('partnerSecurity', schema)
