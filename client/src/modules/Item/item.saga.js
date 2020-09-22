import axios from 'axios'
import { push } from 'connected-react-router'
import { call, put, take, all, takeLatest } from 'redux-saga/effects'

import {
  ITEM_CREATE_REQUEST,
  ITEM_READ_MANY_REQUEST,
  ITEM_READ_ONE_REQUEST,
  ITEM_UPDATE_REQUEST,
  ITEM_EDIT,
  itemCreateSuccess,
  itemCreateFailure,
  itemReadManySuccess,
  itemReadManyFailure,
  itemReadOneRequest,
  itemReadOneSuccess,
  itemReadOneFailure,
  itemUpdateSuccess,
  itemUpdateFailure
} from './item.redux'

export function* itemCreate({ payload }) {
  try {
    // POST REQUEST
    const { data } = yield call(axios.post, '/api/items', payload)
    yield put(itemCreateSuccess(data))
    yield alert('registro guardado')
  } catch (error) {
    console.log(error)
    yield put(itemCreateFailure('Fail items create request'))
  }
}

export function* itemReadMany() {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, '/api/items')
    yield put(itemReadManySuccess(data))
  } catch (error) {
    yield put(itemReadManyFailure('Fail items read many request'))
  }
}

export function* itemReadOne({ id }) {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, `/api/items/${id}`)
    yield put(itemReadOneSuccess(data))
  } catch (error) {
    yield put(itemReadOneFailure('Fail items read one request'))
  }
}

export function* itemUpdate({ payload }) {
  try {
    // POST REQUEST
    yield call(axios.put, `/api/items/${payload.id}`, payload)
    yield put(itemUpdateSuccess(payload))
    yield alert('Registro actualizado')
  } catch (error) {
    console.log(error)
    yield put(itemUpdateFailure('Fail items update request'))
  }
}

export function* itemEdit({ id }) {
  // Dispatch get request
  yield put(itemReadOneRequest(id))
  // Router component
  yield put(push(`/items/update/${id}`))
}

export function* itemsSagas() {
  yield all([
    takeLatest(ITEM_CREATE_REQUEST, itemCreate),
    takeLatest(ITEM_READ_MANY_REQUEST, itemReadMany),
    takeLatest(ITEM_READ_ONE_REQUEST, itemReadOne),
    takeLatest(ITEM_UPDATE_REQUEST, itemUpdate),
    takeLatest(ITEM_EDIT, itemEdit)
  ])
}
