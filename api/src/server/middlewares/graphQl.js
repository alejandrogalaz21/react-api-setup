import config from './../config'
import { Router } from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './../../../graphql'

const router = new Router()
//This route will be used as an endpoint to interact with Graphql,
//All queries will go through this route.
router.use(
  config.graphqlUrl,
  graphqlHTTP({
    //directing express-graphql to use this schema to map out the graph
    schema,
    //directing express-graphql to use graphiql when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql: true
  })
)

export default router
