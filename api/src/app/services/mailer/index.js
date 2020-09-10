import Email from 'email-templates'
import path from 'path'
import appRoot from 'app-root-path'
import getMailer from './configuration'

const mailerPath = [appRoot.path, 'src', 'mvc', 'services', 'mailer']

const generateMailer = async () => {
  try {
    const { email, transport } = await getMailer()

    const mailsTemplate = path.join(...mailerPath, 'templates')

    return new Email({
      views: {
        root: mailsTemplate
      },
      message: {
        from: email
      },
      juice: true,
      preview: false,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(...mailerPath, 'build')
        }
      },
      send: true,
      transport: {
        ...transport,
        auth: {
          user: transport.auth.user,
          pass: transport.auth.pass
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export { generateMailer }
