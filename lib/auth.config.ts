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
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
