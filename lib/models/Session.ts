import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ideas: [{
    type: String,
    trim: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  peekCount: {
    type: Number,
    default: 0
  },
  lastPeekedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.models.Session || mongoose.model('Session', sessionSchema)