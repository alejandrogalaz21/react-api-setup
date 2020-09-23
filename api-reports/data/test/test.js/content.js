const axios = require('axios')
const nodemailer = require('nodemailer')



async function beforeRender(req, res) {
  const resData = await axios.get('http://jsonplaceholder.typicode.com/posts')
  console.log(resData.data)
  req.data.posts = resData.data
 
}

async function afterRender(req, res) {
  const title =  req.data.posts[0].title 
 
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: 'probono@softtek.com',
      pass: 'BPsoft#1',
    },
  })

  await transporter.sendMail({
    from: 'Jan Blaha <probono@softtek.com>',
    to: 'alejandrogalaz21@gmail.com',
    subject: title,
    text: 'See the attached report',
    html: '<b>See the attached report</b>',
    attachments: [
      {
        filename: 'Report.pdf',
        content: Buffer.from(res.content),
      },
    ],
  })
}
