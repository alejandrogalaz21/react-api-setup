import * as fs from 'fs'
import appRoot from 'app-root-path'

export async function downloadReportAndDelete(res, buffer, timeOut = 3000) {
  // write report buffer to a file
  const reportName = 'report.pdf'
  await fs.writeFileSync(reportName, buffer.content)
  const file = `${appRoot}/${reportName}`
  res.download(file)
  await setTimeout(async function () {
    await fs.unlinkSync(file)
    console.log(`file : ${reportName} was deleted`)
  }, timeOut)
}
