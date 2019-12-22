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
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  )

  app.use('/auth', authRouter)
  app.use('/todos', todoRouter)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      recipeLoader: recipeLoader(),
      userLoader: userLoader(),
    }),
    // See this for working variables: https://github.com/MichalLytek/type-graphql/blob/4501867fffe3e6f5b3e71af0b71651efcd48d9c3/examples/query-complexity/index.ts#L16-L64
    //
    // validationRules: [
    //   queryComplexity({
    //     maximumComplexity: 30,
    //     onComplete: (complexity: number) => {
    //       console.log('Query Complexity:', complexity)
    //     },
    //     estimators: [
    //       fieldExtensionsEstimator(),
    //       simpleEstimator({
    //         defaultComplexity: 1,
    //       }),
    //     ],
    //   }) as any,
    // ],
  })

  apolloServer.applyMiddleware({ app, cors: false })

  const PORT = 4000 || process.env.PORT

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

main()
