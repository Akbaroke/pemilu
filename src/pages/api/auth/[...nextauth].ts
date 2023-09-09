import crypto from 'crypto'
import { signIn, signInWithGoogle } from '@/lib/firebase/service'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        const user: any = await signIn({ email })
        if (user) {
          const passwordConfirm = comparePasswords(
            password,
            user.password,
            process.env.NEXT_PUBLIC_SALT as string
          )
          if (passwordConfirm) {
            return user
          }
          return null
        } else {
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === 'credentials' && account?.email) {
        token.name = account.name
        token.email = account.email
      }
      if (account?.provider === 'google' && user?.email) {
        const data = {
          name: user.name,
          email: user.email,
          type: 'google',
        }

        await signInWithGoogle(
          data,
          (result: { status: boolean; message: string; data: any }) => {
            if (result.status) {
              token.name = result.data.name
              token.email = result.data.email
              token.type = result.data.type
            }
          }
        )
      }
      return token
    },

    async session({ session, token }: any) {
      if (token?.name) {
        session.user.name = token.name
      }
      if (token?.email) {
        session.user.email = token.email
      }

      return session
    },
  },
}

export default NextAuth(authOptions)

function comparePasswords(inputPassword: string, hashedPassword: string, salt: string) {
  const inputHashedPassword = crypto
    .createHmac('sha256', salt)
    .update(inputPassword)
    .digest('hex')
  return inputHashedPassword === hashedPassword
}
