import Mailer from './../../models/mailer'
import { isEmpty } from './../../../util'
import { decryptionAES as decrypt } from './../../../util/encryption'
import config from './../../../server/config/config'

const getMailerConfig = async () => {
  try {
    let response = {}

    const doc = await Mailer.findOne({ active: true })
      .select('email transport -_id')
      .lean()

    if (!isEmpty(doc)) {
      response = { ...doc }
      response.transport.auth = {
        user: decrypt(doc.transport.auth.user, config.secret),
        pass: decrypt(doc.transport.auth.pass, config.secret)
      }
    }

    return response
  } catch (e) {
    console.log(e)
  }
}

export default getMailerConfig
