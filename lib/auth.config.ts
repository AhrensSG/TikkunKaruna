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
        const { verifyPassword } = await import('@/lib/auth')
        const pool = (await import('@/lib/db')).default

        const email = credentials.email as string
        const password = credentials.password as string

        const result = await pool.query(
          'SELECT id, name, email, phone, role, password FROM users WHERE email = $1',
          [email]
        )

        if (result.rows.length === 0) return null

        const user = result.rows[0]
        const valid = await verifyPassword(password, user.password)

        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: null,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const pool = (await import('@/lib/db')).default

          const email = profile?.email
          if (!email) return false

          const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
          if (exists.rows.length === 0) {
            await pool.query(
              `INSERT INTO users (name, email, phone, password, role)
               VALUES ($1, $2, '', '', 'user')
               ON CONFLICT (email) DO NOTHING`,
              [profile?.name || email.split('@')[0], email]
            )
          }
        } catch (e) {
          console.error('Google signIn DB error:', e)
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      const pool = (await import('@/lib/db')).default

      if (trigger === 'update' && token.id) {
        const dbUser = await pool.query(
          'SELECT image FROM users WHERE id = $1',
          [token.id]
        )
        if (dbUser.rows.length > 0) {
          token.image = dbUser.rows[0].image
        }
      }

      if (account?.provider === 'google') {
        try {
          const dbUser = await pool.query(
            'SELECT id, role, image FROM users WHERE email = $1',
            [token.email]
          )
          if (dbUser.rows.length > 0) {
            token.id = dbUser.rows[0].id
            token.role = dbUser.rows[0].role
            token.image = dbUser.rows[0].image
          }
        } catch (e) {
          console.error('jwt google lookup error:', e)
          token.role = token.role || 'user'
        }
      } else if (user) {
        token.id = user.id
        token.role = user.role || 'user'
        try {
          const dbUser = await pool.query(
            'SELECT image FROM users WHERE id = $1',
            [user.id]
          )
          if (dbUser.rows.length > 0) {
            token.image = dbUser.rows[0].image
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
        ;(session.user as any).role = token.role
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
