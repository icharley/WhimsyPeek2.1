'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, VolumeX, Clock, Palette, Bell } from 'lucide-react'
import Link from 'next/link'

export default function Settings() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState({
    soundEnabled: true,
    peekDelay: 3000,
    theme: 'default',
    notifications: true,
    animationSpeed: 'normal'
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('whimsy-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('whimsy-settings', JSON.stringify(newSettings))
  }

  if (!session) {
    return <div>Please sign in to access settings.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {settings.soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-primary-600 mr-3" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-400 mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Sound Effects</h3>
                  <p className="text-sm text-gray-600">Play sounds during peek animations</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Peek Delay Settings */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Peek Delay</h3>
                <p className="text-sm text-gray-600">How long to wait before revealing results</p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={settings.peekDelay}
                onChange={(e) => updateSetting('peekDelay', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1s</span>
                <span className="font-medium">{settings.peekDelay / 1000}s</span>
                <span>10s</span>
              </div>
            </div>
          </div>

          {/* Animation Speed */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Palette className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Animation Speed</h3>
                <p className="text-sm text-gray-600">Control the speed of peek animations</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['slow', 'normal', 'fast'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSetting('animationSpeed', speed)}
                  className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                    settings.animationSpeed === speed
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified about app updates</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={session.user?.name || ''}
                  className="input-field"
                  placeholder="Enter your preferred name"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Name changes are managed through your Google account
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={session.user?.email || ''}
                  className="input-field"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}