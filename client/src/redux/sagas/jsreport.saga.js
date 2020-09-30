import axios from 'axios'
import { call, all, takeLatest } from 'redux-saga/effects'

function* getReport({ template }) {
  const { data } = yield call(axios, {
    url: '/api/report',
    method: 'POST',
    responseType: 'blob',
    data: {
      template,
      recipe: 'chrome-pdf'
    }
  })
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'file.pdf')
  document.body.appendChild(link)
  link.click()
}

export function* jsReportSagas() {
  yield all([takeLatest('REPORT', getReport)])
}
