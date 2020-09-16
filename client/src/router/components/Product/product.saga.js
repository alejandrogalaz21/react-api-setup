import axios from 'axios'
import { push } from 'connected-react-router'
import { call, put, take, all, takeLatest } from 'redux-saga/effects'

import {
  PRODUCT_CREATE_REQUEST,
  PRODUCT_READ_MANY_REQUEST,
  PRODUCT_READ_ONE_REQUEST,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_EDIT,
  productCreateSuccess,
  productCreateFailure,
  productReadManySuccess,
  productReadManyFailure,
  productReadOneSuccess,
  productReadOneFailure,
  productUpdateSuccess,
  productUpdateFailure,
  productReadOneRequest
} from './product.redux'

export function* productCreate({ payload }) {
  try {
    // POST REQUEST
    const { data } = yield call(axios.post, '/api/products', payload)
    yield put(productCreateSuccess(data))
    yield alert('registro guardado')
  } catch (error) {
    console.log(error)
    yield put(productCreateFailure('Fail products create request'))
  }
}

export function* productReadMany() {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, '/api/products')
    yield put(productReadManySuccess(data))
  } catch (error) {
    yield put(productReadManyFailure('Fail products read many request'))
  }
}

export function* productReadOne({ payload }) {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, `/api/products/${payload}`)
    yield put(productReadOneSuccess(data))
  } catch (error) {
    yield put(productReadOneFailure('Fail products read one request'))
  }
}

export function* productUpdate({ payload }) {
  try {
    // POST REQUEST
    yield call(axios.put, `/api/products/${payload.id}`, payload)
    yield put(productUpdateSuccess(payload))
    yield alert('Registro actualizado')
    yield put(push('/products'))
  } catch (error) {
    console.log(error)
    yield put(productUpdateFailure('Fail products update request'))
  }
}

export function* productEdit({ id }) {
  // Dispatch get request
  yield put(productReadOneRequest(id))
  // Router component
  yield put(push(`/products/update/${id}`))
}

export function* productsSagas() {
  yield all([
    takeLatest(PRODUCT_CREATE_REQUEST, productCreate),
    takeLatest(PRODUCT_READ_MANY_REQUEST, productReadMany),
    takeLatest(PRODUCT_READ_ONE_REQUEST, productReadOne),
    takeLatest(PRODUCT_UPDATE_REQUEST, productUpdate),
    takeLatest(PRODUCT_EDIT, productEdit)
  ])
}
