'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Plus, LogOut, Sparkles, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import SessionCard from './SessionCard'
import SessionModal from './SessionModal'
import PeekModal from './PeekModal'

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

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [peekSession, setPeekSession] = useState<Session | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSessions(sessions)
    } else {
      const filtered = sessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.ideas.some(idea => idea.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredSessions(filtered)
    }
  }, [sessions, searchQuery])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = () => {
    setEditingSession(null)
    setShowSessionModal(true)
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setShowSessionModal(true)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setSessions(sessions.filter(s => s._id !== sessionId))
        }
      } catch (error) {
        console.error('Failed to delete session:', error)
      }
    }
  }

  const handleSessionSaved = (savedSession: Session) => {
    if (editingSession) {
      setSessions(sessions.map(s => s._id === savedSession._id ? savedSession : s))
    } else {
      setSessions([savedSession, ...sessions])
    }
    setShowSessionModal(false)
    setEditingSession(null)
  }

  const handlePeek = (session: Session) => {
    if (session.ideas.length === 0) {
      alert('This session has no ideas to peek at!')
      return
    }
    setPeekSession(session)
  }

  const handlePeekComplete = (updatedSession: Session) => {
    setSessions(sessions.map(s => s._id === updatedSession._id ? updatedSession : s))
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Whimsy Peek</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name || user.email}</span>
              <Link
                href="/settings"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Idea Sessions</h2>
            <p className="text-gray-600 mt-1">
              Create sessions and let whimsy guide your next adventure
            </p>
          </div>
          <button
            onClick={handleCreateSession}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions and ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or create a new session
                </p>
                <button
                  onClick={handleCreateSession}
                  className="btn-primary"
                >
                  Create New Session
                </button>
              </>
            ) : (
              <>
                <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first idea session to get started with Whimsy Peek
                </p>
                <button
                  onClick={handleCreateSession}
                  className="btn-primary"
                >
                  Create Your First Session
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
                onPeek={handlePeek}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showSessionModal && (
        <SessionModal
          session={editingSession}
          onSave={handleSessionSaved}
          onClose={() => {
            setShowSessionModal(false)
            setEditingSession(null)
          }}
        />
      )}

      {peekSession && (
        <PeekModal
          session={peekSession}
          onClose={() => setPeekSession(null)}
          onPeekComplete={handlePeekComplete}
        />
      )}
    </div>
  )
}