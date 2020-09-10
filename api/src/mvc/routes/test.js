import * as test from './../controllers/test'
import { Router } from 'express'
const router = new Router()

/**
 *@access    Public
 *@route     GET api/test
 *@desc      get all the records.
 *@params    none.
 */
router.get('/test', test.index)

// /**
//  *@access    Public
//  *@route     GET api/private/todo/count
//  *@desc      return the count of all records.
//  *@params    none.
//  */
// router.get(routeCount, count)

/**
 *@access    Public
 *@route     GET api/private/todo/id
 *@desc      get single record.
 *@params    id.
 */
router.get('/test/:id', test.show)

/**
 *@access    Private
 *@route     POST api/private/todo
 *@desc      create a record.
 *@params    Object.
 */
router.post('/test', test.create)

// /**
//  *@access    Private
//  *@route     PUT api/private/todo/id
//  *@desc      update a record.
//  *@params    id, Object.
//  */
// router.put(routeId, update)

// /**
//  *@access    Private
//  *@route     PUT api/private/todo/activate/id
//  *@desc      update a record.
//  *@params    id, Object.
//  */
// router.put(active, activate)

// /**
//  *@access    Private
//  *@route     DELETE api/private/todo/id
//  *@desc      delte a record.
//  *@params    id, Object.
//  */
// router.delete(routeId, destroy)

export default router
