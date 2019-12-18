import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { verify } from 'jsonwebtoken'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'

import { User } from './entity/User'
import resolvers from './resolvers'
import { generateAccessToken, generateRefreshToken } from './utils/authUtils'
import { sendRefreshToken } from './utils/sendRefreshToken'

const main = async () => {
  await createConnection()

  const app = express()

  app.use(cookieParser())
  app.use(cors())

  app.get('/', (req, res) => res.send('Hello'))

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid

    if (!token) {
      res.send({ ok: false, accessToken: '' })
    }

    let payload: any = null

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch (error) {
      console.log(error)
      return res.send({ ok: false, accessToken: '' })
    }

    const user = await User.findOne({ id: payload.userId })

    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if (user.token_version !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, generateRefreshToken(user))

    return res.send({ ok: true, accessToken: generateAccessToken(user) })
  })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  })

  apolloServer.applyMiddleware({ app })

  const PORT = 4000 || process.env.PORT

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

main()
