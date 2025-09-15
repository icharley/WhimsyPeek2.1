'use client'

import { Edit, Trash2, Eye, Lightbulb, Target } from 'lucide-react'

interface Session {
  _id: string
  title: string
  description: string
  ideas: string[]
  peekCount: number
  lastPeekedAt?: string
  createdAt: string
  updatedAt: string
}

interface SessionCardProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (sessionId: string) => void
  onPeek: (session: Session) => void
}

export default function SessionCard({ session, onEdit, onDelete, onPeek }: SessionCardProps) {
  const hasBeenPeeked = session.peekCount > 0

  return (
    <div className="card p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {session.title}
            </h3>
            {hasBeenPeeked && (
              <div className="ml-2 flex items-center">
                <Target className="h-4 w-4 text-accent-500" />
                <span className="text-xs text-accent-600 ml-1 font-medium">
                  {session.peekCount}
                </span>
              </div>
            )}
          </div>
          {session.description && (
            <p className="text-gray-600 text-sm mb-3">
              {session.description}
            </p>
          )}
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(session)}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit session"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(session._id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-500">
          <Lightbulb className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {session.ideas.length} idea{session.ideas.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {hasBeenPeeked && (
            <span className="text-xs bg-accent-100 text-accent-800 px-2 py-1 rounded-full">
              Peeked {session.peekCount}x
            </span>
          )}
          {session.ideas.length > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Ready to peek
            </span>
          )}
        </div>
      </div>

      {session.ideas.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Recent ideas:</div>
          <div className="space-y-1">
            {session.ideas.slice(0, 3).map((idea, index) => (
              <div key={index} className="text-sm text-gray-700 truncate">
                • {idea}
              </div>
            ))}
            {session.ideas.length > 3 && (
              <div className="text-xs text-gray-500">
                +{session.ideas.length - 3} more...
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(session)}
          className="flex-1 btn-secondary text-sm"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onPeek(session)}
          disabled={session.ideas.length === 0}
          className="flex-1 btn-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="h-3 w-3 mr-1" />
          Peek
        </button>
      </div>
    </div>
  )
}