'use strict'

const test = require('tap').test
const fastify = require('fastify')
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema

const typeDefs = `
type Query {
    hello: String
}
`

const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const opts = {
  graphql: {
    schema
  },
  graphiql: {
    endpointURL: '/',
    prefix: '/graphiql'
  }
}

test('GET /graphql', t => {
  t.plan(2)

  const server = fastify()

  server.register(require('./index'), opts)

  server.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 400)
  })
})

test('POST /graphql', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), opts)

  server.inject({
    method: 'POST',
    url: '/',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: {
      query: '{hello}'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.deepEqual(JSON.parse(res.payload).data, { hello: 'world' })
  })
})

test('POST /graphql (error)', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), opts)

  server.inject({
    method: 'POST',
    url: '/',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: {
      query: '{goodbye}'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 400)
    t.deepEqual(JSON.parse(res.payload).errors[0].message, 'Cannot query field "goodbye" on type "Query".')
  })
})

test('GET /graphiql (options as boolean)', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), opts)

  server.inject({
    method: 'GET',
    url: '/graphiql'
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-type'], 'text/html')
  })
})

test('GET /graphiql (options as object)', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), opts)

  server.inject({
    method: 'GET',
    url: '/graphiql'
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-type'], 'text/html')
  })
})

test('GET /schema', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), Object.assign({}, opts, {
    printSchema: true
  }))

  server.inject({
    method: 'GET',
    url: '/schema'
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-type'], 'text/plain')
  })
})
