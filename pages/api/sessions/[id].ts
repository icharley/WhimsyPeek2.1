import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '../../../lib/mongodb'
import Session from '../../../lib/models/Session'
import User from '../../../lib/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method === 'PATCH') {
    try {
      const { title, description, ideas } = req.body

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' })
      }

      const filteredIdeas = ideas ? ideas.filter((idea: string) => idea.trim() !== '') : []

      const updatedSession = await Session.findOneAndUpdate(
        { _id: id, userId: user._id },
        {
          title: title.trim(),
          description: description?.trim() || '',
          ideas: filteredIdeas
        },
        { new: true }
      )

      if (!updatedSession) {
        return res.status(404).json({ message: 'Session not found' })
      }

      res.json(updatedSession)
    } catch (error) {
      console.error('Update session error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedSession = await Session.findOneAndDelete({
        _id: id,
        userId: user._id
      })

      if (!deletedSession) {
        return res.status(404).json({ message: 'Session not found' })
      }

      res.json({ message: 'Session deleted successfully' })
    } catch (error) {
      console.error('Delete session error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}