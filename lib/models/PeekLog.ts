import mongoose from 'mongoose'

const peekLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  sessionTitle: {
    type: String,
    required: true
  },
  selectedIdea: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.PeekLog || mongoose.model('PeekLog', peekLogSchema)