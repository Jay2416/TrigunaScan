'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'
import { getRandomizedQuestions } from '@/data/questions'
import { TestResponse } from '@/types'

export default function PersonalityTest() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [questions, setQuestions] = useState<typeof getRandomizedQuestions extends () => infer R ? R : never>([])

  const likertScale = [
    { value: 1, label: 'Strongly Disagree', emoji: '😤' },
    { value: 2, label: 'Disagree', emoji: '😐' },
    { value: 3, label: 'Neutral', emoji: '😶' },
    { value: 4, label: 'Agree', emoji: '😊' },
    { value: 5, label: 'Strongly Agree', emoji: '😍' }
  ]
  const totalQuestions = questions.length

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Initialize with fresh randomized questions
    if (questions.length === 0) {
      setQuestions(getRandomizedQuestions())
    }
  }, [status, router, questions.length])

  const handleResponse = (value: number) => {
    if (questions.length === 0) return
    
    const questionId = questions[currentQuestion].id
    const newResponses = [...responses]
    const existingIndex = newResponses.findIndex(r => r.questionId === questionId)
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].value = value
    } else {
      newResponses.push({ questionId, value })
    }
    
    setResponses(newResponses)
    setSelectedAnswer(value)
    
    // Auto-progress after a short delay
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        // This is the last question, submit the test
        submitTest(newResponses)
      }
    }, 600) // 600ms delay to show selection feedback
  }


  const submitTest = async (finalResponses?: TestResponse[]) => {
    const responsesToSubmit = finalResponses || responses
    
    if (responsesToSubmit.length !== totalQuestions) {
      setError('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: responsesToSubmit }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit test')
      }

      const result = await response.json()
      router.push('/results')
    } catch (error) {
      setError('Failed to submit test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TriguṇāScan</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Personality Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Question Counter (Hidden from User) */}

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {question.text}
            </h2>
            <p className="text-lg text-gray-600">
              How much do you agree with this statement?
            </p>
          </div>

          {/* Emoji Response Options */}
          <div className="flex justify-center items-center space-x-6 mb-12">
            {likertScale.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(option.value)}
                disabled={loading}
                className={`group flex flex-col items-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  selectedAnswer === option.value
                    ? 'bg-indigo-500 text-white scale-110 shadow-xl'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 shadow-lg'
                }`}
              >
                <div className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-125">
                  {option.emoji}
                </div>
                <span className="text-sm font-medium text-center px-2">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Processing your responses...</p>
            </div>
          )}

          {/* Helper Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Select an emoji that best represents your feeling about this statement.
            </p>
            {selectedAnswer && (
              <p className="text-sm text-indigo-600 mt-2">
                ✨ Response recorded! Moving to next question...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}