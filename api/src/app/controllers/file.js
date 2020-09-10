import appRoot from 'app-root-path'
import file from '../models/file'
import moment from 'moment'
import fs from 'fs'

const uploads = `${appRoot}/public/uploads/`

// @params     parameters here.
// @desc       desription method.
export const index = (req, res) => {
  file
    .find({})
    .populate('created_by')
    .populate('updated_by')
    .populate('deleted_by')
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(error => {
      return res.status(500).json({ error })
    })
}

// @params     query string id.
// @desc       desription method.
export const show = (req, res) => {
  file
    .findById(req.params.id)
    .populate('created_by')
    .populate('updated_by')
    .populate('deleted_by')
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(error => {
      return res.status(500).json({ error })
    })
}

// @params     parameters here.
// @desc       desription method.
export const create = (req, res) => {
  try {
    const mime = req.files.filepond.mimetype
    console.log(mime)
    if (Object.keys(req.files).length == 0)
      return res.status(400).send('alert.error')
    if (req.files.size <= 4) return res.status(400).send('alert.error')
    if (
      mime === 'image/gif' ||
      mime === 'image/jpeg' ||
      mime === 'image/png' ||
      mime === 'image/svg+xml' ||
      mime === 'video/mp4'
    ) {
      console.log(`mimetype : ${mime}`)
      const fileRequest = req.files.filepond
      const { name: filename, mimetype } = req.files.filepond

      // Remove the parentheses and spaces with underscores
      const underscoredFilename = filename.replace(/\ |\(|\)/g, '_')

      const timestamp = moment().format('YYYY-MM-DD-hh-mm-ss')

      // Format the filename
      //  timestamp(YYYY-MM-DD-hh-mm-ss)_<filename, replacing spaces or parentheses for underscores>
      const formattedFilename = `${timestamp}_${underscoredFilename}`

      fileRequest.mv(`${uploads}${formattedFilename}`, error => {
        if (error)
          return res.status(500).json({ message: 'alert.errorGeneralTitle' })
      })
      const fileData = {
        filename: formattedFilename,
        mimetype,
        path: `/uploads/${formattedFilename}`
        // uploadedBy: req.user._id
      }
      file
        .create(fileData)
        .then(doc => res.status(200).json(doc))
        .catch(error => {
          return res.status(500).json({ error })
        })
    } else {
      console.log('not valid')
      console.log(`mimetype : ${mime}`)
      return res.status(500).json({ message: 'alert.file' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// @params     parameters here.
// @desc       desription method.
export const update = (req, res) => {
  file
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(error => {
      return res.status(500).json({ error })
    })
}

// @params     parameters here.
// @desc       desription method.
export const destroy = (req, res) => {
  file
    .findByIdAndRemove(req.params.id, req.body)
    .exec()
    .then(doc => {
      try {
        fs.unlinkSync(`${uploads}${doc.filename}`)
        res.status(200).json({ message: 'file deleted successfully' })
      } catch (error) {
        return res.status(500).json({ error })
      }
    })
    .catch(error => {
      return res.status(500).json({ error })
    })
}

// @params     none.
// @desc       count all the records.
export const count = (req, res) => {
  file
    .count({})
    .exec()
    .then(doc => res.status(200).json({ count: doc }))
    .catch(error => {
      return res.status(500).json({ error })
    })
}
