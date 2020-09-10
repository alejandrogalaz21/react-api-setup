import { emitEventAccess } from './../../sockets/eventWs'
import Event from './../models/event'
import Partner from './../models/partner'
import { isEmpty } from './../../util'

const populate = [
  {
    path: 'entries.partner exits.partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

// Show all attendances for a specific event
export const showAttendance = async (req, res) => {
  try {
    const isSamePartner = entry => exit => exit.partner._id.equals(entry.partner._id)

    const event = await Event.findOne(req.params).populate(populate).lean()
    const attendance = event.entries.map(entry => {
      const hasExited = event.exits.find(isSamePartner(entry))
      return hasExited ? { ...entry, exit: hasExited.date } : entry
    })
    const payload = { ...event, attendance }

    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Create entry for an event
export const createEntry = async (req, res) => {
  try {
    const { uuid } = req.params
    const partner = await Partner.findOne({ uuid: req.body.partnerUuid })

    if (partner.status !== 1) throw 'Socio no activo'

    const access = { entries: { partner } }
    const data = { ...req.body, $push: { ...access } }

    const alreadyRegistered = await Event.findOne({
      uuid,
      entries: { $elemMatch: { partner } }
    })

    const event = await Event.findOne({ uuid })

    if (!partner) throw 'Sin resultados'
    if (!isEmpty(alreadyRegistered)) throw 'Ya registrado'
    if (!event.institution.equals(partner.institution))
      throw 'El socio no pertenece a la sede del evento'

    const payload = await Event.findOneAndUpdate({ uuid }, data, { new: true }).populate(
      'entries.partner'
    )

    res.status(200).json(payload)
    emitEventAccess(uuid)
    return
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Create exit for an event
export const createExit = async (req, res) => {
  try {
    const request = req.body
    const { uuid } = req.params

    const partner = await Partner.findOne({ uuid: request.partnerUuid })

    if (partner.status !== 1) throw 'Socio no activo'

    const access = { exits: { partner: partner } }
    const data = { ...request, $push: { ...access } }

    const isValid = await Event.findOne({
      uuid,
      entries: { $elemMatch: { partner: partner } },
      exits: { $not: { $elemMatch: { partner: partner } } }
    })

    const event = await Event.findOne({ uuid })

    if (!partner) throw 'Sin resultados'
    if (isEmpty(isValid)) throw 'Acceso no válido'
    if (!event.institution.equals(partner.institution))
      throw 'El socio no pertenece a la sede del evento'

    const result = await Event.findOneAndUpdate({ uuid }, data, { new: true })
      .populate('exits.partner')
      .lean()

    let payload = result

    if (result && result.entries.length === result.exits.length) {
      payload = { ...result, complete: true }
    }

    res.status(200).json(payload)
    emitEventAccess(uuid)
    return
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
