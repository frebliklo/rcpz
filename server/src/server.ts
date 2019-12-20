import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import queryComplexity, {
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'

import { recipeLoader } from './loaders/RecipeLoader'
import { userLoader } from './loaders/UserLoader'
import resolvers from './resolvers'
import { authRouter, todoRouter } from './routers'

const main = async () => {
  await createConnection()

  const app = express()

  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(cors())

  app.use('/auth', authRouter)
  app.use('/todos', todoRouter)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      recipeLoader: recipeLoader(),
      userLoader: userLoader(),
    }),
    validationRules: [
      queryComplexity({
        maximumComplexity: 30,
        variables: {},
        onComplete: (complexity: number) => {
          console.log('Query Complexity:', complexity)
        },
        estimators: [
          fieldExtensionsEstimator(),
          simpleEstimator({
            defaultComplexity: 1,
          }),
        ],
      }) as any,
    ],
  })

  apolloServer.applyMiddleware({ app })

  const PORT = 4000 || process.env.PORT

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

main()
