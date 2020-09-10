import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4 },
    date: { type: Date, required: true },
    user: { type: ObjectId, ref: 'user', required: true },
    partner: { type: ObjectId, ref: 'partner', required: true },
    //personal information
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    //clinic history
    clinic: {
      //section 1
      crawl: { type: String, required: true, trim: true },
      way: { type: String, required: true, trim: true },
      speaks: { type: String, required: true, trim: true },
      sphincters: { type: String, required: true, trim: true },
      wear: { type: String, required: true, trim: true },
      problems: [
        {
          type: String,
          required: true,
          enum: ['Alcoholismo', 'Emocionales', 'Habla o lenguaje', 'Drogas', 'Ninguno']
        }
      ],
      devAbnormal: [
        {
          type: String,
          required: true,
          enum: [
            'Se tardó en hablar',
            'Alguna operación',
            'Algún accidente',
            'Enfermedades continuas',
            'Ninguno'
          ]
        }
      ],
      disease: [
        {
          type: String,
          required: true,
          enum: [
            'Sarampión',
            'Rubéola',
            'Varicela',
            'Fracturas',
            'Convulsiones',
            'Ninguno'
          ]
        }
      ],
      //section 2
      chronicle: { type: Boolean, required: true },
      justification: String,
      treatment: { type: Boolean, required: true },
      justification2: String,
      allergy: { type: Boolean, required: true },
      justification3: String,
      //section 3
      secure: [
        {
          type: String,
          required: true,
          enum: ['IMSS', 'ISSSTE', 'ISSSTELEON', 'Seguro popular', 'Ninguno']
        }
      ],
      other: { type: Boolean, required: true },
      justification4: String,
      //section 4
      ear: { type: Boolean, required: true },
      justification5: String,
      date: Date,
      view: { type: Boolean, required: true },
      justification6: String,
      date2: Date,
      neurological: { type: Boolean, required: true },
      justification7: String,
      date3: Date,
      psychologic: { type: Boolean, required: true },
      justification8: String,
      date4: Date,
      other2: { type: Boolean, required: true },
      justification9: String,
      date5: Date,
      attention: [
        {
          type: String,
          required: true,
          enum: [
            'Con un maestro particular',
            'Terapia de lenguaje',
            'Terapia de aprendizaje',
            'Con un psicólogo',
            'Ninguno'
          ]
        }
      ],
      other3: { type: String, required: true, trim: true },
      //section 5
      medicine: { type: String, required: true, enum: ['Si', 'No'] },
      accident: { type: String, required: true, enum: ['Si', 'No'] }
    },
    //school history
    school: {
      //section 1
      kindergarten: { type: Boolean, required: true },
      age: Number,
      kinder: { type: Boolean, required: true },
      age2: Number,
      primary: { type: Boolean, required: true },
      age3: Number,
      //section 2
      absent: { type: String, required: true, trim: true },
      changeSchool: { type: Boolean, required: true },
      cant: String,
      repeated: { type: Boolean, required: true },
      justification: String,
      cant2: String,
      problem: { type: Boolean, required: true },
      justification2: String,
      help: { type: Boolean, required: true },
      justification3: String,
      prom: { type: Number, required: true }
    },
    //emotional context
    emotional: {
      //section 1
      son: {
        type: String,
        required: true,
        enum: [
          'Único',
          'Adoptivo',
          'Ilegitimo',
          'Mimado',
          'Deseado',
          'No deseado',
          'Huérfano',
          'Rechazado'
        ]
      },
      ageMotherMarried: { type: Number, required: true },
      ageFatherMarried: { type: Number, required: true },
      ageMother: { type: Number, required: true },
      ageFather: { type: Number, required: true },
      divorce: { type: Boolean, required: true },
      reasonDivorce: String,
      alcoholicFather: { type: String, required: true, enum: ['Si', 'No'] },
      alcoholicMother: { type: String, required: true, enum: ['Si', 'No'] },
      contextSon: [
        {
          type: String,
          required: true,
          enum: [
            'Feliz',
            'Satisfactoria',
            'Irritable',
            'Agresiva',
            'Inestable',
            'Perjudicial',
            'Autoritaria'
          ]
        }
      ],
      //section 2
      permitted: { type: String, required: true, enum: ['Si', 'No'] },
      obligation: { type: Boolean, required: true },
      justification: String,
      obedient: { type: Boolean, required: true },
      homeObedient: String,
      schoolObedient: String,
      methods: { type: String, required: true, trim: true },
      tantrums: { type: String, required: true, trim: true },
      justification2: { type: String, required: true, trim: true }
    },
    //interests and hobbies
    hobbies: {
      freeTime: [
        {
          type: String,
          required: true,
          enum: [
            'Dormir',
            'Deportes',
            'Ver TV',
            'Jugar en la calle',
            'Juegos electrónicos o celulares'
          ]
        }
      ],
      other: { type: String, required: true, trim: true },
      entertainment: { type: String, required: true, trim: true },
      activities: { type: String, required: true, trim: true },
      areas: {
        humanDev: [
          {
            type: String,
            required: true,
            enum: [
              'Derechos',
              'Habilidades y destrezas',
              'Valores',
              'Cuidado ambiental',
              'Inteligencia'
            ]
          }
        ],
        arts: [
          {
            type: String,
            required: true,
            enum: ['Pintura', 'Música', 'Danza', 'Manualidades']
          }
        ],
        education: [
          {
            type: String,
            required: true,
            enum: [
              'Asesorías para prepa',
              'Computación',
              'Taller de lectura',
              'Taller de matemáticas',
              'Apoyo en tareas'
            ]
          }
        ],
        sports: [
          {
            type: String,
            required: true,
            enum: [
              'Futbol',
              'Básquetbol',
              'Voleibol',
              'Handball',
              'Tae kwon do',
              'Karate'
            ]
          }
        ]
      }
    },
    //socioeconomic data
    socioeconomic: {
      members: [
        {
          name: { type: String, required: true, trim: true },
          age: { type: Number, required: true },
          relationship: { type: String, required: true, trim: true },
          // Estado civil: 'Soltero', 'Casado', 'Viudo', 'Unión libre', 'Divorciado'
          civilStatus: { type: Number, enum: [0, 1, 2, 3, 4] },
          scholarship: {
            type: String,
            required: true,
            enum: [
              'Primaria',
              'Secundaria',
              'Preparatoria',
              'Educación superior',
              'Ninguno'
            ]
          },
          occupation: { type: String, required: true, trim: true }
        }
      ],
      income: { type: String, required: true, trim: true },
      monthly: { type: Number, required: true },
      home: {
        type: String,
        required: true,
        enum: ['Propia', 'Rentada', 'Prestada', 'La esta pagando']
      }
    },
    //food Bank
    foodBank: {
      foods: { type: Number, required: true },
      breakfast: { type: String, required: true, trim: true },
      fruitsVegetables: { type: Boolean, required: true },
      justification: String
    },
    //human rights
    humanRights: {
      rights: { type: Boolean, required: true },
      justification: String,
      moreRights: { type: Boolean, required: true },
      justification2: String
    },
    //security data
    security: {
      chargePerson: { type: String, required: true, trim: true },
      transfer: { type: String, required: true, trim: true },
      companion: { type: String, required: true, trim: true }
    },
    observation: { type: String, required: true, trim: true },
    firm: { type: String, required: true, trim: true },
    detail: [
      {
        cause: String,
        description: String,
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        created_by: { type: ObjectId, ref: 'user', default: null }
      }
    ],
    active: { type: Boolean, default: true },
    institution: { type: ObjectId, ref: 'institution' },
    created_by: { type: ObjectId, ref: 'user', default: null },
    updated_by: { type: ObjectId, ref: 'user', default: null }
  },
  schemaConfig
)

export default mongoose.model('familyInterview', schema)
