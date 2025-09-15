import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import dbConnect from '../../../../lib/mongodb'
import Session from '../../../../lib/models/Session'
import PeekLog from '../../../../lib/models/PeekLog'
import User from '../../../../lib/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()
  
  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const { id } = req.query

  try {
    const sessionDoc = await Session.findOne({ _id: id, userId: user._id })
    
    if (!sessionDoc) {
      return res.status(404).json({ message: 'Session not found' })
    }

    if (sessionDoc.ideas.length === 0) {
      return res.status(400).json({ message: 'No ideas in this session' })
    }

    // Select random idea
    const randomIndex = Math.floor(Math.random() * sessionDoc.ideas.length)
    const selectedIdea = sessionDoc.ideas[randomIndex]

    // Update session peek count and last peeked date
    await Session.findByIdAndUpdate(id, {
      $inc: { peekCount: 1 },
      lastPeekedAt: new Date()
    })

    // Log the peek for admin analytics
    await PeekLog.create({
      userId: user._id,
      sessionId: sessionDoc._id,
      sessionTitle: sessionDoc.title,
      selectedIdea,
      userEmail: session.user.email
    })

    res.json({ 
      selectedIdea,
      peekCount: sessionDoc.peekCount + 1
    })
  } catch (error) {
    console.error('Peek error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}