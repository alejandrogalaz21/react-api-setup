import mongoose from 'mongoose'
import jsreport from 'jsreport'
import bcrypt from 'bcryptjs'
import User from './../models/user'
import Position from './../models/position'
import Permission from './../models/permissions'
import { saveValidation } from './../validation/user'
import { generateMailer } from './../services/mailer'
import { getUsers, getUser } from './../queries/user.report'
import { mdy } from './../../util/dates'
import { generatePassword } from './../../util/authHelpers'
import { createMatrix, getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import config from './../../server/config/config'
import { isEmpty } from './../../util'

export const index = async (req, res) => {
  try {
    const payload = await getUsers(req.filterQuery)
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const show = async (req, res) => {
  try {
    const payload = await getUser(req.params)
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const edit = async (req, res) => {
  try {
    const payload = await User.findOne(req.filterQuery)
      .populate('institutions', 'name')
      .populate({ path: 'permissions.permissions', select: '-user' })
      .populate({ path: 'permissions.institution', select: '-detail' })
      .lean()

    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const create = async (req, res) => {
  try {
    const created_by = req.user._id
    const detail = {
      cause: 'Creación',
      description: 'Nuevo usuario agregado',
      created_by
    }
    const request = { ...req.body, detail: [detail] }

    // Generate the salt and hash
    const password = generatePassword(10)
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    // Store the documment on the DB, with the hashed password
    const data = { ...request, password: hashed, permissions: [], created_by }
    const user = await User.create(data)

    if (user.role !== 2) {
      const hostname = config.env === 'develop' ? 'localhost:3000' : req.headers.host
      const url = `http://${hostname}/login`

      const mailer = await generateMailer()
      await mailer.send({
        template: 'register',
        message: { to: data.email },
        locals: { url, password }
      })
    }

    // Save permissions
    if (!isEmpty(req.body.permissions)) {
      let insertedPermissions = []
      for (const permissions of req.body.permissions) {
        const inserted = await createPermissions(permissions, user)
        insertedPermissions.push(inserted)
      }

      // Update the users with the permissions
      const updated = await User.findByIdAndUpdate(
        user._id,
        { permissions: insertedPermissions },
        { new: true }
      )
        .sort({ updatedAt: -1 })
        .populate('institutions', 'name')
        .populate('thumbnail', 'path')
        .lean()

      return res.status(200).json(updated)
    }

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const update = async (req, res) => {
  try {
    const updated_by = req.user._id
    let { payload, detail } = req.body
    detail = { ...detail, created_by: updated_by }
    const query = { uuid: req.params.uuid }

    const user = await User.findOne(query)

    // Update position reference
    if (user.position !== payload.position) {
      const userId = { users: user._id }
      await Position.findByIdAndUpdate(user.position, { $pull: userId })
      await Position.findByIdAndUpdate(payload.position, { $push: userId })
    }

    // Old permissiions to remove
    const permissionsToRemove = user.permissions.reduce((pre, cur) => {
      pre = [...pre, ...cur.permissions]
      return pre
    }, [])

    // Remove from DB user old permissions
    await Permission.deleteMany({ _id: { $in: permissionsToRemove } })
    await User.findOneAndUpdate(query, { permissions: [] })

    // Insert the user new permissions
    let insertedPermissions = []

    const includesInstitution = institutions => p => institutions.includes(p.institution)
    const newPermissions = payload.permissions.filter(
      includesInstitution(payload.institutions)
    )

    for (const permissions of newPermissions) {
      const inserted = await createPermissions(permissions, user)
      insertedPermissions.push(inserted)
    }

    const result = await User.findOneAndUpdate(
      query,
      { ...payload, permissions: insertedPermissions, updated_by, $push: { detail } },
      { new: true }
    )
      .populate('institutions', 'name')
      .populate('thumbnail', 'path')
      .lean()

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const validate = async (req, res) => {
  try {
    const request = req.body
    const validate = await saveValidation(User)(request, request.uuid)
    return res.status(200).json(validate)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const toggle = async (req, res) => {
  try {
    const updated_by = req.user._id
    const query = { uuid: req.params.uuid }
    const detail = { ...req.body.detail, created_by: updated_by }
    const { active } = await User.findOne(query)

    const doc = await User.findOneAndUpdate(
      query,
      { active: !active, login: false, updated_by, $push: { detail } },
      { new: true }
    )
      .populate('institutions', 'name')
      .populate('thumbnail', 'path')
      .lean()

    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const destroy = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const doc = await User.findOneAndRemove(query).exec()
    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const count = async (req, res) => {
  try {
    const doc = await User.countDocuments(req.filterQuery).exec()
    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const roles = ['Administrador', 'Usuario', 'Colaborador']

    const data = await getUsers(req.filterQuery)
    const columns = [
      { title: 'Nombre', value: row => `${row.name} ${row.lastName}` },
      { title: 'Rol', value: row => roles[row.role] },
      { title: 'Sedes', value: row => row.role === 0 ? 'Todas' : getInstitutionNames(row.institutions) },
      { title: 'Estatus', value: row => (row.active ? 'Activo' : 'No activo') },
      { title: 'Creado', value: row => mdy(row.createdAt) }
    ]

    const reportData = createMatrix(data, columns)

    jsreport
      .render({
        template: {
          name: 'ExportPdf',
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '100px',
            marginBottom: '80px'
          }
        },
        data: { ...reportData, title: 'Usuarios', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
  try {
    const roles = ['Administrador', 'Usuario', 'Colaborador']

    const data = await getUser(req.filterQuery)
    const columns = [
      { title: 'Nombre', value: row => `${row.name} ${row.lastName}` },
      { title: 'Rol', value: row => roles[row.role] },
      { title: 'Correo electrónico', value: 'email' },
      { title: 'Puesto', value: row => row.position.name },
      { title: 'Sedes', value: row => row.role === 0 ? 'Todas' : getInstitutionNames(row.institutions) },
      { title: 'Estatus', value: row => (row.active ? 'Activo' : 'No activo') },
      { title: 'Creado', value: row => mdy(row.createdAt) }
    ]

    const reportData = getDetail(data, columns)

    jsreport
      .render({
        template: {
          name: 'ExportPdf',
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '100px',
            marginBottom: '80px'
          }
        },
        data: { reportData, title: 'Usuarios', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

async function createPermissions({ institution, permissions }, user) {
  const addPermissions = permissions
    .filter(p => p.create || p.read || p.update || p.delete)
    .map(p => ({ ...p, user, institution }))
  const inserted = await Permission.insertMany(addPermissions)

  return { institution, permissions: inserted.map(item => item._id) }
}

function getInstitutionNames(institutions) {
  return institutions.map(item => item.name).join(', ')
}
