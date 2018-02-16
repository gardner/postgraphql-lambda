const { Pool } = require('pg')
const { graphql } = require('graphql')
const { createPostGraphQLSchema, withPostGraphQLContext } = require('postgraphql')
const myPgPool = new Pool()

const pgPort = process.env.PGPORT || 5432
const pgDatabase = process.env.PGDATABASE || 'postgres'
const pgHost = process.env.PGHOST || 'postgres'
const pgPassword = process.env.PGPASSWORD || 'postgres'
const pgUser = process.env.PGUSER || 'postgres'
const pgSchema = process.env.PGSCHEMA || 'public'
const jwtSecret = process.env.JWT_SECRET || Math.random().toString(36).substring(7)

const pgUrl = `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`
const variables = null
const jwtToken = ''
var schema

module.exports.handler = (event, context, cb) => {
  // @see https://gist.github.com/hassy/eaea5a958067211f2fed02ead13c2678
  context.callbackWaitsForEmptyEventLoop = false
  console.log('context', JSON.stringify(context))

  createPostGraphQLSchema(pgUrl, pgSchema).then(function (sch) {
    schema = sch

    withPostGraphQLContext(
      {
        pgPool: myPgPool,
        jwtToken: jwtToken,
        // pgDefaultRole: 'cc_person',
        jwtSecret: jwtSecret
      },
      function (ctx) {
        // Execute your GraphQL query in this function with the provided
        // `ctx` object, which should NOT be used outside of this
        // function.
        console.log('EVENT - ', event)
        graphql(
          schema, // This is the schema we created with `createPostGraphQLSchema`.
          event.query ? event.query : event.body.query,
          null,
          ctx || {} // Here we use the `ctx` object that gets passed to this callback.
        ).then(function (result) {
          console.log('-=-=-=-= ctx.then - success', result)
          var response = {
            'statusCode': 200,
            'headers': {
              'X-Version': process.env.X_VERSION || 'unknown'
            },
            'body': JSON.stringify(result),
            'isBase64Encoded': false
          }
          cb(null, response)
          // return context.succeed()
        }).catch(function (reason) {
          console.log('-=-=-=-= ctx.catch - error')
          console.log('error: ', reason)
          cb(new Error(result))
          // return context.fail()
        })
      }
    )
  })
}
