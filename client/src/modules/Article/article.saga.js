import axios from 'axios'
import { push } from 'connected-react-router'
import { call, put, take, all, takeLatest } from 'redux-saga/effects'

import {
  ARTICLE_CREATE_REQUEST,
  ARTICLE_READ_MANY_REQUEST,
  ARTICLE_READ_ONE_REQUEST,
  ARTICLE_UPDATE_REQUEST,
  ARTICLE_EDIT,
  articleCreateSuccess,
  articleCreateFailure,
  articleReadManySuccess,
  articleReadManyFailure,
  articleReadOneRequest,
  articleReadOneSuccess,
  articleReadOneFailure,
  articleUpdateSuccess,
  articleUpdateFailure
} from './article.redux'

export function* articleCreate({ payload }) {
  try {
    // POST REQUEST
    const { data } = yield call(axios.post, '/api/articles', payload)
    yield put(articleCreateSuccess(data))
    yield alert('registro guardado')
    yield put(push('/articles'))
  } catch (error) {
    console.log(error)
    yield put(articleCreateFailure('Fail articles create request'))
  }
}

export function* articleReadMany() {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, '/api/articles')
    yield put(articleReadManySuccess(data))
  } catch (error) {
    yield put(articleReadManyFailure('Fail articles read many request'))
  }
}

export function* articleReadOne({ id }) {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, `/api/articles/${id}`)
    yield put(articleReadOneSuccess(data))
  } catch (error) {
    yield put(articleReadOneFailure('Fail articles read one request'))
  }
}

export function* articleUpdate({ payload }) {
  try {
    // POST REQUEST
    yield call(axios.put, `/api/articles/${payload.id}`, payload)
    yield put(articleUpdateSuccess(payload))
    yield alert('Registro actualizado')
    yield put(push('/articles'))
  } catch (error) {
    console.log(error)
    yield put(articleUpdateFailure('Fail articles update request'))
  }
}

export function* articleEdit({ id }) {
  // Dispatch get request
  yield put(articleReadOneRequest(id))
  // Router component
  yield put(push(`/articles/update/${id}`))
}

export function* articlesSagas() {
  yield all([
    takeLatest(ARTICLE_CREATE_REQUEST, articleCreate),
    takeLatest(ARTICLE_READ_MANY_REQUEST, articleReadMany),
    takeLatest(ARTICLE_READ_ONE_REQUEST, articleReadOne),
    takeLatest(ARTICLE_UPDATE_REQUEST, articleUpdate),
    takeLatest(ARTICLE_EDIT, articleEdit)
  ])
}
