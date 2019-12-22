import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { compare } from 'bcryptjs'

import { Context } from '../types/Context'
import { User } from '../entity/User'
import { AuthResponse, SignInInput, RegisterInput } from '../types/Auth'
import { generateRefreshToken, generateAccessToken, hashPassword } from '../utils/authUtils'
import { sendRefreshToken } from '../utils/sendRefreshToken'

@Resolver()
export class AuthResolver {
  @Mutation(type => AuthResponse)
  async signInWithEmail(
    @Arg('data') { email, password }: SignInInput,
    @Ctx() { res }: Context,
  ): Promise<AuthResponse> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error('Could not find user')
    }

    const valid = await compare(password, user.password)

    if (!valid) {
      throw new Error('Invalid password')
    }

    sendRefreshToken(res, generateRefreshToken(user))

    return {
      accessToken: generateAccessToken(user),
      user,
    }
  }

  // @Mutation(() => Boolean)
  // async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
  //   await getConnection()
  //     .getRepository(User)
  //     .increment({ id: userId }, 'tokenVersion', 1)

  //   return true
  // }

  @Mutation(type => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '')

    return true
  }

  @Mutation(type => AuthResponse)
  async registerWithEmail(
    @Arg('data') { email, password, firstName, lastName }: RegisterInput,
  ): Promise<AuthResponse | null> {
    const hashedPassword = await hashPassword(password)

    try {
      const user = await User.create({
        email,
        first_name: firstName,
        last_name: lastName ? lastName : '',
        password: hashedPassword,
      }).save()

      return {
        accessToken: generateAccessToken(user!),
        user,
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
