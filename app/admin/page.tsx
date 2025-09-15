'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Users, Eye, TrendingUp, Calendar } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalPeeks: number
  recentSignups: number
  peeksToday: number
  recentActivity: Array<{
    type: 'signup' | 'peek'
    email: string
    timestamp: string
    sessionTitle?: string
  }>
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      fetchAdminStats()
    }
  }, [session])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Access denied. Admin privileges required.')
      }
    } catch (err) {
      setError('Failed to load admin stats')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Whimsy Peek Analytics & Monitoring</p>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-accent-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Peeks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPeeks}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recent Signups</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recentSignups}</p>
                    <p className="text-xs text-gray-500">Last 7 days</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Peeks Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.peeksToday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        {activity.type === 'signup' ? (
                          <Users className="h-4 w-4 text-green-600 mr-3" />
                        ) : (
                          <Eye className="h-4 w-4 text-accent-500 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'signup' ? 'New signup' : 'Peek performed'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.email}
                            {activity.sessionTitle && ` • ${activity.sessionTitle}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}