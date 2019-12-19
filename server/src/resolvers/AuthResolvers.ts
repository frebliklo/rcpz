import { ObjectType, Field, Resolver, Mutation, Arg, Ctx, InputType } from 'type-graphql'
import { compare } from 'bcryptjs'

import { Context } from '../types/Context'
import { User } from '../entity/User'
import { generateRefreshToken, generateAccessToken, hashPassword } from '../utils/authUtils'
import { sendRefreshToken } from '../utils/sendRefreshToken'

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string

  @Field(() => User)
  user: User
}

@InputType()
class SignInInput {
  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
class RegisterInput extends SignInInput {
  @Field()
  firstName: string

  @Field()
  lastName: string
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
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

  @Mutation(() => AuthResponse)
  async registerWithEmail(
    @Arg('data') { email, password, firstName, lastName }: RegisterInput,
  ): Promise<AuthResponse | null> {
    const hashedPassword = await hashPassword(password)

    try {
      const user = await User.create({
        email,
        first_name: firstName,
        last_name: lastName,
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
