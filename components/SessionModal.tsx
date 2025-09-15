'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

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

interface SessionModalProps {
  session: Session | null
  onSave: (session: Session) => void
  onClose: () => void
}

export default function SessionModal({ session, onSave, onClose }: SessionModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ideas, setIdeas] = useState([''])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      setTitle(session.title)
      setDescription(session.description || '')
      setIdeas(session.ideas.length > 0 ? session.ideas : [''])
    }
  }, [session])

  const handleAddIdea = () => {
    setIdeas([...ideas, ''])
  }

  const handleRemoveIdea = (index: number) => {
    if (ideas.length > 1) {
      setIdeas(ideas.filter((_, i) => i !== index))
    }
  }

  const handleIdeaChange = (index: number, value: string) => {
    const newIdeas = [...ideas]
    newIdeas[index] = value
    setIdeas(newIdeas)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const filteredIdeas = ideas.filter(idea => idea.trim() !== '')
    const sessionData = {
      title: title.trim(),
      description: description.trim(),
      ideas: filteredIdeas
    }

    try {
      const url = session ? `/api/sessions/${session._id}` : '/api/sessions'
      const method = session ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      })
      
      if (response.ok) {
        const savedSession = await response.json()
        onSave(savedSession)
      } else {
        throw new Error('Failed to save session')
      }
    } catch (error) {
      console.error('Failed to save session:', error)
      alert('Failed to save session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {session ? 'Edit Session' : 'Create New Session'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g., Date Night Ideas, Weekend Activities"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Brief description of this session..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Ideas
                </label>
                <button
                  type="button"
                  onClick={handleAddIdea}
                  className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Idea
                </button>
              </div>
              
              <div className="space-y-3">
                {ideas.map((idea, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={idea}
                      onChange={(e) => handleIdeaChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Idea ${index + 1}...`}
                    />
                    {ideas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIdea(index)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Add as many ideas as you want. Empty ideas will be automatically removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                session ? 'Update Session' : 'Create Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}