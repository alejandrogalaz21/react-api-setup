import {
  USERS_CREATE_REQUEST,
  USERS_CREATE_SUCCESS,
  USERS_CREATE_FAILURE,
  USERS_READ_MANY_REQUEST,
  USERS_READ_MANY_SUCCESS,
  USERS_READ_MANY_FAILURE,
  USERS_READ_ONE_REQUEST,
  USERS_READ_ONE_SUCCESS,
  USERS_READ_ONE_FAILURE,
  USERS_UPDATE_REQUEST,
  USERS_UPDATE_SUCCESS,
  USERS_UPDATE_FAILURE,
  USERS_REMOVE_REQUEST,
  USERS_REMOVE_SUCCESS,
  USERS_REMOVE_FAILURE,
  usersCreateRequest,
  usersCreateSuccess,
  usersCreateFailure,
  usersReadManyRequest,
  usersReadManySuccess,
  usersReadManyFailure,
  usersReadOneRequest,
  usersReadOneSuccess,
  usersReadOneFailure,
  usersUpdateRequest,
  usersUpdateSuccess,
  usersUpdateFailure
} from './users.redux'

describe('actions', () => {
  // CREATE
  it('should create action USERS_CREATE_REQUEST', () => {
    const payload = null
    const expectedAction = { type: USERS_CREATE_REQUEST, payload }
    expect(usersCreateRequest()).toEqual(expectedAction)
  })
  it('should create action USERS_CREATE_SUCCESS', () => {
    const payload = {
      prop: 'prop example'
    }
    const expectedAction = { type: USERS_CREATE_SUCCESS, payload }
    expect(usersCreateSuccess(payload)).toEqual(expectedAction)
  })
  it('should create action USERS_CREATE_FAILURE', () => {
    const payload = null
    const expectedAction = { type: USERS_CREATE_FAILURE, payload }
    expect(usersCreateFailure()).toEqual(expectedAction)
  })

  // READ MANY
  it('should create action USERS_READ_MANY_REQUEST', () => {
    const payload = null
    const expectedAction = { type: USERS_READ_MANY_REQUEST, payload }
    expect(usersReadManyRequest()).toEqual(expectedAction)
  })

  it('should create action USERS_READ_MANY_SUCCESS', () => {
    const payload = [1, 2, 3, 4]
    const expectedAction = { type: USERS_READ_MANY_SUCCESS, payload }
    expect(usersReadManySuccess(payload)).toEqual(expectedAction)
  })
  it('should create action USERS_READ_MANY_FAILURE', () => {
    const payload = null
    const expectedAction = { type: USERS_READ_MANY_FAILURE, payload }
    expect(usersReadManyFailure()).toEqual(expectedAction)
  })

  // READ
  it('should create action USERS_READ_ONE_REQUEST', () => {
    const payload = null
    const expectedAction = { type: USERS_READ_ONE_REQUEST, payload }
    expect(usersReadOneRequest()).toEqual(expectedAction)
  })
  it('should create action USERS_READ_ONE_SUCCESS', () => {
    const payload = {
      prop: 'prop example'
    }
    const expectedAction = { type: USERS_READ_ONE_SUCCESS, payload }
    expect(usersReadOneSuccess(payload)).toEqual(expectedAction)
  })
  it('should create action USERS_READ_ONE_FAILURE', () => {
    const payload = null
    const expectedAction = { type: USERS_READ_ONE_FAILURE, payload }
    expect(usersReadOneFailure()).toEqual(expectedAction)
  })

  // UPDATE
  it('should create action USERS_UPDATE_REQUEST', () => {
    const payload = null
    const expectedAction = { type: USERS_UPDATE_REQUEST, payload }
    expect(usersUpdateRequest()).toEqual(expectedAction)
  })
  it('should create action USERS_UPDATE_SUCCESS', () => {
    const payload = {
      prop: 'prop example'
    }
    const expectedAction = { type: USERS_UPDATE_SUCCESS, payload }
    expect(usersUpdateSuccess(payload)).toEqual(expectedAction)
  })
  it('should create action USERS_UPDATE_FAILURE', () => {
    const payload = null
    const expectedAction = { type: USERS_READ_ONE_FAILURE, payload }
    expect(usersUpdateFailure()).toEqual(expectedAction)
  })
})
