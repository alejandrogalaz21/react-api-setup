import mongoose from 'mongoose'
import uuidv4 from 'uuid/v4'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.ObjectId
const schemaConfig = { timestamps: true }

const schema = new Schema(
  {
    uuid: { type: String, default: uuidv4 },
    partner: { type: ObjectId, ref: 'partner', required: true },
    user: { type: ObjectId, ref: 'user', required: true },
    date: { type: Date, required: true },
    age: { type: Number, required: true },
    schoolId: { type: ObjectId, ref: 'school' },
    address: {
      address: { type: String, required: true, trim: true },
      lat: { type: Number },
      lng: { type: Number }
    },
    //identification data section
    identification: {
      laterality: { type: String, required: true, trim: true },
      inscription: { type: String, required: true, trim: true }
    },
    //family middle section
    family: {
      life: { type: String, required: true, trim: true },
      cant: { type: String, required: true, trim: true },
      relationship: { type: String, required: true, trim: true },
      home: { type: String, required: true, trim: true }
    },
    //middle school section
    school: {
      year: { type: Number, required: true },
      turn: { type: String, required: true, enum: ['Matutino', 'Vespertino'] },
      tutorName: { type: String, required: true, trim: true },
      tutorDescription: { type: String, required: true, trim: true },
      tutorRelationship: { type: String, required: true, trim: true },
      friends: { type: String, required: true, enum: ['Si', 'No'] },
      whoFriends: { type: String, required: true, trim: true },
      friendsRelationship: { type: String, required: true, trim: true },
      friendsAct: { type: String, required: true, trim: true }
    },
    //discipline section
    discipline: {
      whoPunishment: { type: String, required: true, trim: true },
      whyPunishment: { type: String, required: true, trim: true },
      howPunishment: { type: String, required: true, trim: true },
      doPunishment: { type: String, required: true, trim: true },
      fellPunishment: { type: String, required: true, trim: true }
    },
    //emotions section
    emotions: {
      worst: { type: String, required: true, trim: true },
      best: { type: String, required: true, trim: true },
      sad: { type: String, required: true, trim: true },
      happy: { type: String, required: true, trim: true },
      angry: { type: String, required: true, trim: true },
      whatDo: {
        angry: { type: String, required: true, trim: true },
        sad: { type: String, required: true, trim: true },
        happy: { type: String, required: true, trim: true }
      }
    },
    //ideal section
    ideal: {
      big: { type: String, required: true, trim: true },
      justificationBig: { type: String, required: true, trim: true },
      now: { type: String, required: true, trim: true },
      justificationNow: { type: String, required: true, trim: true },
      desiredAge: { type: Number, required: true },
      justificationAge: { type: String, required: true, trim: true },
      changeParents: { type: String, required: true, trim: true },
      justificationParents: { type: String, required: true, trim: true },
      changeHome: { type: String, required: true, trim: true },
      justificationHome: { type: String, required: true, trim: true }
    },
    //likes and interests section
    interests: {
      freeTime: { type: String, required: true, trim: true },
      //sports
      sports: {
        sportsTeam: { type: String, required: true, enum: ['Si', 'No'] },
        where: { type: String, required: true, trim: true },
        knownSports: { type: String, required: true, trim: true },
        practisedSports: { type: String, required: true, trim: true },
        wherePractised: { type: String, required: true, trim: true },
        likeSports: {
          type: String,
          required: true,
          enum: [
            'Handball',
            'Futbol',
            'Básquetbol',
            'Voleibol',
            'Tae Kwon Do',
            'Karate',
            'Activación física'
          ]
        },
        justification: { type: String, required: true, trim: true },
        sportsClasses: { type: String, required: true, trim: true }
      },
      //arts
      arts: {
        description: { type: String, required: true, trim: true },
        options: {
          type: String,
          required: true,
          enum: ['Danza', 'Manualidades', 'Pintura', 'Música']
        },
        crafts: { type: String, required: true, trim: true },
        origami: { type: Boolean, required: true },
        origamiDescription: String,
        musicalInstruments: { type: String, required: true, trim: true },
        optionsInstruments: {
          type: String,
          required: true,
          enum: [
            'Violín',
            'Piano',
            'Guitarra',
            'Batería',
            'Chelo',
            'Maracas',
            'Platillos',
            'Flauta'
          ]
        },
        paintingWork: { type: String, required: true, enum: ['Si', 'No'] },
        justification: { type: String, required: true, trim: true },
        artsClasses: { type: String, required: true, trim: true }
      },
      //education
      education: {
        bestSubject: { type: String, required: true, trim: true },
        justificationBest: { type: String, required: true, trim: true },
        worstSubject: { type: String, required: true, trim: true },
        justificationWorst: { type: String, required: true, trim: true },
        activities: {
          type: String,
          required: true,
          enum: [
            'Apoyo con tareas',
            'Computación',
            'Taller de lectura',
            'Taller de matemáticas'
          ]
        },
        educationClasses: { type: String, required: true, trim: true }
      },
      //human development
      humanDev: {
        humanDev: { type: String, required: true, trim: true },
        childRights: { type: String, required: true, enum: ['Si', 'No'] },
        justificationRights: { type: String, required: true, trim: true },
        feel: { type: String, required: true, trim: true },
        attention: {
          type: String,
          required: true,
          enum: [
            'Habilidades y destrezas',
            'Inteligencia emocional',
            'Cuidado ambiental',
            'Derechos',
            'Grupo de lideres',
            'Valores'
          ]
        },
        justificationAttention: { type: String, required: true, trim: true },
        recycling: { type: String, required: true, trim: true },
        humanDevClasses: { type: String, required: true, trim: true }
      },
      //food Bank
      foodBank: {
        foods: { type: Number, required: true },
        breakfast: { type: String, required: true, trim: true },
        glassesWater: { type: Number, required: true },
        fruitsVegetables: { type: String, required: true, enum: ['Si', 'No'] },
        justification: { type: String, required: true, trim: true }
      }
    },
    //wishes
    wishes: {
      wishes: { type: String, required: true, trim: true },
      companion: { type: String, required: true, trim: true },
      justification: { type: String, required: true, trim: true }
    },
    clubRegulations: { type: Boolean, default: false },
    observations: { type: String, required: true, trim: true },
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

export default mongoose.model('childInterview', schema)
