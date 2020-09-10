import Daom from './daom'
import Partner from './../models/partner'
import Programming from './../models/programming'
import PartnerParent from './../models/partnerParent'
import PartnerSecurity from './../models/partnerSecurity'
import Institution from './../models/institution'
import { populate as programmingPopulate } from './programming'
import { padWithZeros } from '../../util/strings'

const partner = new Daom(Partner)
const institution = new Daom(Institution)
const partnerParent = new Daom(PartnerParent)
const partnerSecurity = new Daom(PartnerSecurity)
const programming = new Daom(Programming)

const populate = [
  { path: 'father mother family security group' },
  { path: 'school', select: 'name grade' },
  {
    path: 'thumbnail',
    select: 'path'
  },
  {
    path: 'access',
    options: { sort: { date: -1 } }
  }
]
const select = 'uuid name lastName fullName id group thumbnail shift birthDate status '

/**
 * @param   None
 * @return  Retrieve partner (to implement pagination)
 */
export function getAllPartner() {
  return partner
    .get()
    .populate('group', 'name color')
    .populate('thumbnail', 'path')
    .select(select + 'detail createdAt')
    .sort({ updatedAt: -1 })
}

/**
 * @params  query
 * @summary Retrieve partner (to implement pagination)
 */
export function showPartnerInformation(query) {
  return partner
    .getOne(query)
    .populate('group', 'name color')
    .populate('school', 'name grade')
    .populate('thumbnail', 'path')
    .populate('security', 'uuid')
    .populate('family', 'uuid name lastName phone cellphone relationship')
    .select(select + 'school address family genre security')
}

/**
 * @param {*} req
 * @returns
 */
export function showPartner(query) {
  return partner.getOne(query).populate(populate)
}

/**
 * @param {*} req
 * @returns
 */
export function showSchedule(query) {
  return programming.getOne(query).populate(programmingPopulate)
}

/**
 * @param {*} payload
 * @returns
 */
export function createPartner(payload) {
  const { family, security } = payload
  // Generate a generic detail record to append to the documen to be created
  const detail = { cause: 'Creación', description: 'Nuevo socio agregado' }

  return Promise.all([partnerParent.create(...family), partnerSecurity.create(security)])
    .then(values => {
      // Create the related documents that extends the partner information
      const [familyIds, securityId] = values

      const data = {
        ...payload,
        family: familyIds,
        security: securityId,
        detail: [detail]
      }

      return institution.getOne({ _id: payload.institution }).then(sede => {
        return partner.count({ institution: payload.institution }).then(partners => {
          const enrollment = partners + 1
          const id = sede.code + padWithZeros(enrollment, 6)

          return partner.create({ ...data, id, enrollment })
        })
      })
    })
    .then(doc => {
      const update = { partner: doc._id }
      return Promise.all([
        partner.getOne({ _id: doc._id }).populate(populate),
        partnerParent.update({ _id: { $in: doc.family } }, update),
        partnerSecurity.update({ _id: doc.security }, update)
      ])
    })
    .then(([doc]) => {
      return doc
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @param {*} req
 * @returns
 */
export function updatePartner({ uuid }, { payload, detail }) {
  const query = { uuid }
  // Update the partner information
  const data = { ...payload, $push: { detail } }
  return partner.update(query, data).populate(populate)
}

/**
 * @param {*} req
 * @returns
 */
export function togglePartner(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return partner
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }
      // Toggle the parent active property
      return partner.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @param {*} req
 * @returns
 */
export function toggleSubscribePartner(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return partner
    .getOne(query)
    .then(doc => {
      const status = doc.status === 2 ? 1 : 2
      const data = { status, $push: { detail } }
      return partner.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @param {*} req
 * @returns
 */
export function destroyPartner(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return partner.delete(query)
}
