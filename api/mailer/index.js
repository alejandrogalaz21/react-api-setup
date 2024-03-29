import Email from 'email-templates'
import path from 'path'
import { MAILER } from './../keys'

export const generateMailer = async () => {
  try {
    const templates = path.resolve(__dirname, 'templates')

    const mailer = new Email({
      transport: MAILER,
      views: {
        root: templates
        // options: { extension: 'hbs' }
      },
      message: { from: MAILER.auth.user },
      preview: false,
      send: true,
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'build')
        }
      }
    })

    return mailer
  } catch (error) {
    console.log(error)
  }
}
