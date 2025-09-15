'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'

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

interface PeekModalProps {
  session: Session
  onClose: () => void
  onPeekComplete: (session: Session) => void
}

export default function PeekModal({ session, onClose, onPeekComplete }: PeekModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [peekCount, setPeekCount] = useState(session.peekCount)

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
  const [currentDice, setCurrentDice] = useState(0)

  useEffect(() => {
    startPeekAnimation()
  }, [])

  const startPeekAnimation = async () => {
    setIsAnimating(true)
    setShowResult(false)

    // Get user settings
    const settings = JSON.parse(localStorage.getItem('whimsy-settings') || '{}')
    const peekDelay = settings.peekDelay || 3000
    const soundEnabled = settings.soundEnabled !== false
    const animationSpeed = settings.animationSpeed || 'normal'

    // Play sound if enabled
    if (soundEnabled && typeof window !== 'undefined') {
      try {
        const audio = new Audio('/sounds/peek-start.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {}) // Ignore errors if sound fails
      } catch (error) {
        // Ignore sound errors
      }
    }

    // Animate dice rolling with speed adjustment
    const speedMultiplier = animationSpeed === 'fast' ? 0.5 : animationSpeed === 'slow' ? 2 : 1
    const diceInterval = setInterval(() => {
      setCurrentDice(prev => (prev + 1) % diceIcons.length)
    }, 150 * speedMultiplier)

    // Stop animation and show result
    setTimeout(async () => {
      clearInterval(diceInterval)
      
      try {
        // Call API to perform peek and get result
        const response = await fetch(`/api/sessions/${session._id}/peek`, {
          method: 'POST'
        })
        
        if (response.ok) {
          const data = await response.json()
          setSelectedIdea(data.selectedIdea)
          setPeekCount(data.peekCount)
          
          // Update parent component with new peek count
          onPeekComplete({
            ...session,
            peekCount: data.peekCount,
            lastPeekedAt: new Date().toISOString()
          })
          
          // Play success sound
          if (soundEnabled && typeof window !== 'undefined') {
            try {
              const audio = new Audio('/sounds/peek-result.mp3')
              audio.volume = 0.5
              audio.play().catch(() => {})
            } catch (error) {
              // Ignore sound errors
            }
          }
        } else {
          throw new Error('Failed to peek')
        }
      } catch (error) {
        console.error('Peek error:', error)
        // Fallback to client-side random selection
        const randomIndex = Math.floor(Math.random() * session.ideas.length)
        setSelectedIdea(session.ideas[randomIndex])
      }
      
      setIsAnimating(false)
      setShowResult(true)
    }, peekDelay)

    return () => clearInterval(diceInterval)
  }

  const handlePeekAgain = () => {
    startPeekAnimation()
  }

  const DiceIcon = diceIcons[currentDice]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary-50 to-accent-50">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary-600" />
            Whimsy Peek
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-6">
            {session.title}
          </h3>

          {isAnimating ? (
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <DiceIcon className="h-16 w-16 text-primary-600 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-medium text-gray-900 animate-pulse">
                  Peeking into the possibilities...
                </div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : showResult ? (
            <div className="py-8">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-sm text-gray-600 mb-2">Your whimsical choice is:</div>
              </div>
              
              <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-xl p-6 mb-6">
                <div className="text-2xl font-celebration font-bold text-gray-900 leading-relaxed">
                  {selectedIdea}
                </div>
              </div>

              {peekCount > 1 && (
                <div className="text-xs text-gray-500 mb-4">
                  This session has been peeked {peekCount} times
                </div>
              )}

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handlePeekAgain}
                  className="btn-accent flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Peek Again
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Perfect!
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}