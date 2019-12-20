import { Router, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { User } from '../entity/User'
import { SingInRequest } from '../types/Routers'
import { generateRefreshToken, generateAccessToken, hashPassword } from '../utils/authUtils'
import { sendRefreshToken } from '../utils/sendRefreshToken'
import { UserRole } from '../types/UserInput'

export const router = Router()

router.post('/refresh_token', async (req, res) => {
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

router.post('/signin', async (req: SingInRequest, res: Response) => {
  const { email, password, first_name, last_name, role } = req.body

  const hashedPassword = await hashPassword(password)

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role: role ? role : UserRole.VIEWER,
    }).save()

    res.send({
      accessToken: generateAccessToken(user!),
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(401).send(`Something went wrong: ${error}`)
  }
})
