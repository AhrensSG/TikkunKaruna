import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const { db } = await import('@/lib/db')
        const { users } = await import('@/lib/db/schema')
        const { eq } = await import('drizzle-orm')
        const { verifyPassword } = await import('@/lib/auth')

        const email = credentials.email as string
        const password = credentials.password as string

        const [user] = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            role: users.role,
            password: users.password,
          })
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user) return null
        if (!user.password) return null

        const valid = await verifyPassword(password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'user' | 'admin',
          image: null,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const { db } = await import('@/lib/db')
          const { users } = await import('@/lib/db/schema')
          const { eq } = await import('drizzle-orm')

          const email = profile?.email
          if (!email) return false

          const [existing] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

          if (!existing) {
            await db.insert(users).values({
              name: profile?.name || email.split('@')[0],
              email,
            })
          }
        } catch (e) {
          console.error('Google signIn DB error:', e)
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === 'update' && token.id) {
        const { db } = await import('@/lib/db')
        const { users } = await import('@/lib/db/schema')
        const { eq } = await import('drizzle-orm')

        const [dbUser] = await db
          .select({ image: users.image })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1)

        if (dbUser) {
          token.image = dbUser.image
        }
      }

      if (account?.provider === 'google') {
        try {
          const { db } = await import('@/lib/db')
          const { users } = await import('@/lib/db/schema')
          const { eq } = await import('drizzle-orm')

          const [dbUser] = await db
            .select({
              id: users.id,
              role: users.role,
              image: users.image,
            })
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1)

          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role as 'user' | 'admin'
            token.image = dbUser.image
          }
        } catch (e) {
          console.error('jwt google lookup error:', e)
          token.role = token.role || 'user'
        }
      } else if (user) {
        const { db } = await import('@/lib/db')
        const { users } = await import('@/lib/db/schema')
        const { eq } = await import('drizzle-orm')

        token.id = user.id
        token.role = user.role || 'user'
        try {
          const [dbUser] = await db
            .select({ image: users.image })
            .from(users)
            .where(eq(users.id, user.id!))
            .limit(1)

          if (dbUser) {
            token.image = dbUser.image
          }
        } catch (e) {
          console.error('jwt image lookup error:', e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'user' | 'admin'
        session.user.image = (token.image as string) || null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth-error',
  },
  session: { strategy: 'jwt' },
})
