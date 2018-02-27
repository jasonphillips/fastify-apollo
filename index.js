const apolloGraphqlFastify = require('./graphql')
const apolloGraphiqlFastify = require('./graphiql')

// Avoid `fastify-plugin` overriding prefix
const fp = plugin =>
  require('fastify-plugin')(
    function (fastify, opts, next) {
      fastify.register(plugin, opts, err => {
        next(err)
      })

      next()
    },
    { fastify: '>=0.3.x <1' }
  )

function plugin (fastify, { graphql, graphiql, printSchema }, next) {
  fastify
    .register(apolloGraphiqlFastify, graphiql)
    .register(apolloGraphqlFastify, Object.assign({ printSchema }, graphql))

  next()
}

/**
 * @typedef {function} ApolloServerFastify
 * @extends fastify.FastifyMiddleware
 */
const apolloServerFastify = fp(plugin)

/**
 * @memberof ApolloServerFastify
 * @static
 * @func graphiqlFastify
 */
apolloServerFastify.graphiqlFastify = fp(apolloGraphiqlFastify)

/**
 * @memberof ApolloServerFastify
 * @static
 * @func graphqlFastify
 */
apolloServerFastify.graphqlFastify = fp(apolloGraphqlFastify)

module.exports = apolloServerFastify
