import axios from 'axios'
import { push } from 'connected-react-router'
import { call, put, take, all, takeLatest } from 'redux-saga/effects'

import {
  PRODUCTS_CREATE_REQUEST,
  productsCreateRequest,
  productsCreateSuccess,
  productsCreateFailure,
  PRODUCTS_READ_MANY_REQUEST,
  productsReadManySuccess,
  productsReadManyFailure
} from './products.redux'

export function* productsCreate({ payload }) {
  try {
    // POST REQUEST
    const { data } = yield call(axios.post, '/api/products', payload)
    yield put(productsCreateSuccess(data))
    yield alert('registro guardado')
    // yield push('/products')
  } catch (error) {
    console.log(error)
    yield put(productsCreateFailure('Fail products create request'))
  }
}

export function* productsReadMany() {
  try {
    // GET REQUEST
    const { data } = yield call(axios.get, '/api/products')
    yield put(productsReadManySuccess(data))
  } catch (error) {
    yield put(productsReadManyFailure('Fail products read many request'))
  }
}

export function* productsSagas() {
  yield all([
    takeLatest(PRODUCTS_CREATE_REQUEST, productsCreate),
    takeLatest(PRODUCTS_READ_MANY_REQUEST, productsReadMany)
  ])
}
