import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '../../../lib/mongodb'
import User from '../../../lib/models/User'
import PeekLog from '../../../lib/models/PeekLog'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Check if user is admin
  const adminEmail = process.env.ADMIN_EMAIL
  if (session.user.email !== adminEmail) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' })
  }

  await dbConnect()

  try {
    // Get total users
    const totalUsers = await User.countDocuments()

    // Get total peeks
    const totalPeeks = await PeekLog.countDocuments()

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    // Get peeks today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const peeksToday = await PeekLog.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    })

    // Get recent activity (last 20 items)
    const recentPeeks = await PeekLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userEmail sessionTitle createdAt')

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('email createdAt')

    // Combine and sort recent activity
    const recentActivity = [
      ...recentPeeks.map(peek => ({
        type: 'peek' as const,
        email: peek.userEmail,
        timestamp: peek.createdAt,
        sessionTitle: peek.sessionTitle
      })),
      ...recentUsers.map(user => ({
        type: 'signup' as const,
        email: user.email,
        timestamp: user.createdAt
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)

    res.json({
      totalUsers,
      totalPeeks,
      recentSignups,
      peeksToday,
      recentActivity
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}