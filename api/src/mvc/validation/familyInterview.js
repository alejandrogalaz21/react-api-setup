import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} FamilyInterview
 * @params {*} user,
      date,
      partner,
      observation,
      firm,
      height,
      weight,
      clinic,
      school,
      emotional,
      hobbies,
      socioeconomic,
      foodBank,
      humanRights,
      security, uuid
 * @return object
 * @desc validate the in comming request
 */
export function familyInterviewSaveValidation(FamilyInterview) {
  return async function(
    {
      user,
      date,
      partner,
      observation,
      firm,
      height,
      weight,
      clinic,
      school,
      emotional,
      hobbies,
      socioeconomic,
      foodBank,
      humanRights,
      security
    },
    uuid
  ) {
    const errors = {}
    //request validations required
    if (isEmpty(uuid)) {
      if (isEmpty(partner)) errors.partner = 'El socio es requerido'
    }
    if (isEmpty(user)) errors.user = 'El entrevistador es requerido'
    if (!date) errors.date = 'La fecha de entrevista es requerida'
    if (!observation) errors.observation = 'La observacion es requerida'
    if (!firm) errors.firm = 'La firma es requerida'
    //personal information
    if (!height) errors.height = 'La altura es requerida'
    if (!weight) errors.weight = 'El peso es requerido'
    //clinic section
    if (isEmpty(clinic))
      return {
        isValid: false,
        errors: { ...errors, clinic: 'Información clinica requerida' }
      }
    if (!clinic.crawl)
      errors.clinic = {
        ...errors.clinic,
        crawl: 'Ingresar edad en la que el socio gateo'
      }
    if (!clinic.way)
      errors.clinic = {
        ...errors.clinic,
        way: 'Ingresar edad en la que el socio camino'
      }
    if (!clinic.speaks)
      errors.clinic = {
        ...errors.clinic,
        speaks: 'Ingresar edad en la que el socio empezó a hablar'
      }
    if (!clinic.sphincters)
      errors.clinic = {
        ...errors.clinic,
        sphincters: 'Ingresar edad en la que el socio controló esfínteres'
      }
    if (!clinic.wear)
      errors.clinic = {
        ...errors.clinic,
        wear: 'Ingresar edad en la que el socio se vistio completamente'
      }
    if (isEmpty(clinic.problems))
      errors.clinic = {
        ...errors.clinic,
        problems: 'Problema familiar requerido'
      }
    if (isEmpty(clinic.devAbnormal))
      errors.clinic = {
        ...errors.clinic,
        devAbnormal: 'Desarrollo anormal requerido'
      }
    if (isEmpty(clinic.disease))
      errors.clinic = {
        ...errors.clinic,
        disease: 'Enfermedades que ha padecido requeridas'
      }
    if (isEmpty(clinic.secure))
      errors.clinic = {
        ...errors.clinic,
        secure: 'Servicios médicos requeridos'
      }
    if (isEmpty(clinic.attention))
      errors.clinic = {
        ...errors.clinic,
        attention: 'Ingresar si el menos ha recibido atencion especial anteriormente'
      }
    if (!clinic.other3)
      errors.clinic = {
        ...errors.clinic,
        other3: 'Ingresar si el menos ha recibido otro tipo de atencion especial'
      }
    if (!clinic.medicine)
      errors.clinic = {
        ...errors.clinic,
        medicine: 'Ingresar aceptacion de proporcionar medicamento al menor'
      }
    if (!clinic.accident)
      errors.clinic = {
        ...errors.clinic,
        accident:
          'Ingresar aceptacion de trasladar al menor a un servicio médico en caso de accidente'
      }
    //school history
    if (isEmpty(school))
      return {
        isValid: false,
        errors: { ...errors, school: 'Información historias escolar requerida' }
      }
    if (!school.kindergarten)
      errors.school = {
        ...errors.school,
        kindergarten: 'Ingresar si el niño(a) a asistido a una guarderia'
      }
    if (!school.kinder)
      errors.school = {
        ...errors.school,
        kinder: 'Ingresar si el niño(a) a asistido a un kinder'
      }
    if (!school.primary)
      errors.school = {
        ...errors.school,
        primary: 'Ingresar si el niño(a) a asistido a la primaria'
      }
    if (!school.absent)
      errors.school = {
        ...errors.school,
        absent: 'Razon por la que no asista a la escuela requerida'
      }
    if (!school.prom)
      errors.school = {
        ...errors.school,
        prom: 'Promedio del niño(a) requerido'
      }
    //emotional context
    if (isEmpty(emotional))
      return {
        isValid: false,
        errors: { ...errors, emotional: 'Información contexto emocional requerida' }
      }
    if (isEmpty(emotional.son))
      errors.emotional = {
        ...errors.emotional,
        son: 'Tipo de hijo requerido'
      }
    if (!emotional.ageMotherMarried)
      errors.emotional = {
        ...errors.emotional,
        ageMotherMarried: 'Edad de la madre al casarse requerida'
      }
    if (!emotional.ageFatherMarried)
      errors.emotional = {
        ...errors.emotional,
        ageFatherMarried: 'Edad del padre al casarse requerida'
      }
    if (!emotional.ageMother)
      errors.emotional = {
        ...errors.emotional,
        ageMother: 'Edad de la madre requerida'
      }
    if (!emotional.ageFather)
      errors.emotional = {
        ...errors.emotional,
        ageFather: 'Edad del padre requerida'
      }
    if (!emotional.alcoholicFather)
      errors.emotional = {
        ...errors.emotional,
        alcoholicFather: 'Indicar si el padre es alcohólico'
      }
    if (!emotional.alcoholicMother)
      errors.emotional = {
        ...errors.emotional,
        alcoholicMother: 'Indicar si la madre es alcohólica'
      }
    if (isEmpty(emotional.contextSon))
      errors.emotional = {
        ...errors.emotional,
        contextSon: 'Indicar contexto del niño(a)'
      }
    if (!emotional.permitted)
      errors.emotional = {
        ...errors.emotional,
        permitted: 'Indicar si es que se le permite todo al menor'
      }
    if (!emotional.obligation)
      errors.emotional = {
        ...errors.emotional,
        obligation: 'Indicar si el menor tiene alguna obligación en casa'
      }
    if (!emotional.obedient)
      errors.emotional = {
        ...errors.emotional,
        obedient: 'Indicar si el menor es obediente'
      }
    if (!emotional.methods)
      errors.emotional = {
        ...errors.emotional,
        methods: 'Indicar metodos disciplinarios'
      }
    if (!emotional.tantrums)
      errors.emotional = {
        ...errors.emotional,
        tantrums: 'Motivos de berrinches del menor requerido'
      }
    if (!emotional.justification2)
      errors.emotional = {
        ...errors.emotional,
        justification2: 'Especifique motivo de berrinche'
      }
    //interests and hobbies
    if (isEmpty(hobbies))
      return {
        isValid: false,
        errors: {
          ...errors,
          hobbies: 'Información de intereses y pasatiempos requerida'
        }
      }
    if (isEmpty(hobbies.freeTime))
      errors.hobbies = {
        ...errors.hobbies,
        freeTime: 'Actividades en tiempo libre requeridas'
      }
    if (!hobbies.other)
      errors.hobbies = {
        ...errors.hobbies,
        other: 'Indicar otra actividad de tiempo libre'
      }
    if (!hobbies.entertainment)
      errors.hobbies = {
        ...errors.hobbies,
        entertainment: 'Indique que lugares de diversion que acostumbran visitar'
      }
    if (!hobbies.activities)
      errors.hobbies = {
        ...errors.hobbies,
        activities: 'Indicar actividades que realizan en familia'
      }
    //socioeconomic data
    if (isEmpty(socioeconomic))
      return {
        isValid: false,
        errors: { ...errors, socioeconomic: 'Información socioeconomica requerida' }
      }
    if (!socioeconomic.income)
      errors.socioeconomic = {
        ...errors.socioeconomic,
        income: 'Fuente de ingresos requerida'
      }
    if (!socioeconomic.monthly)
      errors.socioeconomic = {
        ...errors.socioeconomic,
        monthly: 'Ingresos familiares mensuales requeridos'
      }
    if (isEmpty(socioeconomic.home))
      errors.socioeconomic = {
        ...errors.socioeconomic,
        home: 'Indique su tipo de casa'
      }
    //food bank
    if (isEmpty(foodBank))
      return {
        isValid: false,
        errors: { ...errors, foodBank: 'Información de banco de alimentos requerida' }
      }
    if (!foodBank.foods)
      errors.foodBank = {
        ...errors.foodBank,
        foods: 'Ingresar cantidad de comidas en el dia'
      }
    if (!foodBank.breakfast)
      errors.foodBank = {
        ...errors.foodBank,
        breakfast: 'Desayuno requerido'
      }
    if (!foodBank.fruitsVegetables)
      errors.foodBank = {
        ...errors.foodBank,
        fruitsVegetables: 'Indique si consume frutas y verduras en casa'
      }
    //human rights
    if (isEmpty(humanRights))
      return {
        isValid: false,
        errors: { ...errors, humanRights: 'Información de derechos humanos requerida' }
      }
    //security data
    if (isEmpty(security))
      return {
        isValid: false,
        errors: { ...errors, security: 'Información de seguridad requerida' }
      }
    if (!security.chargePerson)
      errors.security = {
        ...errors.security,
        chargePerson: 'Encargado de cuidar al menor requerido'
      }
    if (!security.transfer)
      errors.security = {
        ...errors.security,
        transfer: 'Metodo de traslado del menor requerido'
      }
    if (!security.companion)
      errors.security = {
        ...errors.security,
        companion: 'Acompañante del menor requerido'
      }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
