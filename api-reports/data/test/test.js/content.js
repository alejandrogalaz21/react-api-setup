// hello
const axios = require('axios')
const nodemailer = require('nodemailer')

async function beforeRender(req, res) {
  const resData = await axios.get('http://jsonplaceholder.typicode.com/posts')
  console.log(resData.data)
  req.data.posts = resData.data.slice(0, 5)
}

async function afterRender(req, res) {
  const title = req.data.posts[0].title

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: 'probono@softtek.com',
      pass: ''
    }
  })

  await transporter.sendMail({
    from: 'Jan Blaha <probono@softtek.com>',
    to:
      'alejandrogalaz21@gmail.com,jesus.galaz@softtek.com,nancy.obregon@softtek.com,jonathan.rodriguezs@softtek.com',
    subject: title,
    text: 'See the attached report',
    html: '<b>See the attached report</b>',
    attachments: [
      {
        filename: 'Report.pdf',
        content: Buffer.from(res.content)
      }
    ]
  })
}
