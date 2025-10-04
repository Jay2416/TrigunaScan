'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Brain, 
  Target, 
  ArrowLeft, 
  Heart, 
  Sunrise, 
  Book, 
  Users, 
  Leaf,
  Clock,
  CheckSquare
} from 'lucide-react'
import { TestResult } from '@/types'

export default function Recommendations() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      fetchResults()
    }
  }, [session, status, router])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/test/status')
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      
      const data = await response.json()
      if (data.result) {
        setResult(data.result)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session || !result) {
    return null
  }

  const getPersonalizedRecommendations = (dominantGuna: string) => {
    const baseRecommendations = {
      daily: [
        "Start your day with 10 minutes of meditation or quiet reflection",
        "Practice gratitude by writing down 3 things you're grateful for",
        "Eat fresh, natural foods and avoid processed meals",
        "Spend time in nature, even if just a brief walk",
        "End your day with calming activities like reading or gentle yoga"
      ],
      weekly: [
        "Engage in acts of service or volunteer work",
        "Study philosophical or spiritual texts that inspire you",
        "Practice yoga or other mindful movement",
        "Connect with like-minded individuals who share your values",
        "Declutter your living space to promote mental clarity"
      ],
      mindset: [
        "Cultivate patience in challenging situations",
        "Focus on inner peace rather than external achievements",
        "Practice compassion toward yourself and others",
        "Seek wisdom and understanding in difficult circumstances",
        "Choose harmony over conflict when possible"
      ]
    }

    if (dominantGuna === 'rajas') {
      return {
        ...baseRecommendations,
        specific: [
          "Balance your high energy with periods of rest and reflection",
          "Practice slowing down and savoring moments throughout your day",
          "Channel your ambition toward serving others and contributing to society",
          "Learn to find contentment in the process, not just the outcome",
          "Develop patience through mindfulness practices"
        ]
      }
    } else if (dominantGuna === 'tamas') {
      return {
        ...baseRecommendations,
        specific: [
          "Set small, achievable goals to build momentum",
          "Create gentle routines that gradually introduce positive changes",
          "Find inspiration through uplifting books, music, or communities",
          "Practice self-compassion while working toward growth",
          "Use your natural stability to support others in their growth"
        ]
      }
    } else {
      return {
        ...baseRecommendations,
        specific: [
          "Continue to deepen your meditation and mindfulness practices",
          "Share your wisdom and balance with others who need guidance",
          "Maintain your ethical standards while being compassionate",
          "Use your natural harmony to help resolve conflicts around you",
          "Keep learning and growing in spiritual or philosophical understanding"
        ]
      }
    }
  }

  const recommendations = getPersonalizedRecommendations(result.dominantGuna)

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
              <Link
                href="/results"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Results
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Path to Enhanced Sattva
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized recommendations to cultivate harmony, wisdom, and inner peace based on your 
            <span className="font-semibold text-indigo-600 capitalize"> {result.dominantGuna}</span> nature.
          </p>
        </div>

        {/* Personalized Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
            <Heart className="h-6 w-6 mr-2" />
            Personalized for Your {result.dominantGuna.charAt(0).toUpperCase() + result.dominantGuna.slice(1)} Nature
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {recommendations.specific.map((recommendation, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Practices */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sunrise className="h-6 w-6 mr-2 text-orange-500" />
            Daily Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.daily.map((practice, index) => (
              <div key={index} className="flex items-start p-4 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{practice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activities */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-green-500" />
            Weekly Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.weekly.map((activity, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mindset Shifts */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            Mindset Shifts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.mindset.map((mindset, index) => (
              <div key={index} className="flex items-start p-4 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">{mindset}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Book className="h-6 w-6 mr-2 text-indigo-500" />
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Meditation Apps</h3>
              <p className="text-sm text-gray-600">Headspace, Calm, Insight Timer for guided meditation practices</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Book className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Recommended Reading</h3>
              <p className="text-sm text-gray-600">Bhagavad Gita, yoga philosophy, and mindfulness literature</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Local yoga studios, meditation groups, or spiritual communities</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Brain className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <Link
            href="/results"
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Target className="h-5 w-5 mr-2" />
            View Results Again
          </Link>
        </div>
      </div>
    </div>
  )
}