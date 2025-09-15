import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '../../../lib/mongodb'
import User from '../../../lib/models/User'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId
            })
          }
          
          return true
        } catch (error) {
          console.error('Error saving user:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        await dbConnect()
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser) {
          session.user.id = dbUser._id.toString()
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
})