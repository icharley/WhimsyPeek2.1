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

  if (req.method === 'GET') {
    try {
      const { search } = req.query
      
      let query: any = { userId: user._id }
      
      if (search && typeof search === 'string') {
        query = {
          userId: user._id,
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { ideas: { $elemMatch: { $regex: search, $options: 'i' } } }
          ]
        }
      }
      
      const sessions = await Session.find(query).sort({ updatedAt: -1 })
      res.json(sessions)
    } catch (error) {
      console.error('Get sessions error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, ideas } = req.body

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' })
      }

      const filteredIdeas = ideas ? ideas.filter((idea: string) => idea.trim() !== '') : []

      const newSession = new Session({
        title: title.trim(),
        description: description?.trim() || '',
        ideas: filteredIdeas,
        userId: user._id
      })

      await newSession.save()
      res.status(201).json(newSession)
    } catch (error) {
      console.error('Create session error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}