import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  provider: {
    type: String,
    default: 'google'
  },
  providerId: {
    type: String
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)