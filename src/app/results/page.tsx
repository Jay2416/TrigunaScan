'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Brain, 
  BarChart3, 
  Target, 
  ArrowLeft, 
  Download, 
  Share2,
  Lightbulb,
  TrendingUp,
  Heart,
  Zap,
  Moon
} from 'lucide-react'
import { TestResult } from '@/types'

export default function Results() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      setError('Failed to load results')
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

  const getGunaIcon = (guna: string) => {
    switch (guna) {
      case 'sattva': return <Heart className="h-6 w-6" />
      case 'rajas': return <Zap className="h-6 w-6" />
      case 'tamas': return <Moon className="h-6 w-6" />
      default: return <Brain className="h-6 w-6" />
    }
  }

  const getGunaColor = (guna: string) => {
    switch (guna) {
      case 'sattva': return 'blue'
      case 'rajas': return 'red'
      case 'tamas': return 'gray'
      default: return 'indigo'
    }
  }

  const getGunaDescription = (guna: string) => {
    switch (guna) {
      case 'sattva':
        return {
          title: 'Sattva - Purity & Balance',
          description: 'You embody the qualities of purity, balance, clarity, and ethical conduct. Sattva represents harmony, knowledge, spiritual growth, and inner peace.',
          traits: ['Clear and focused thinking', 'Emotionally regulated and stable', 'Motivated by selfless service', 'Guided by ethical principles', 'Maintains inner contentment', 'Prefers pure, natural foods'],
          areas: ['Continue deepening contemplative practices', 'Share your wisdom through teaching or mentoring', 'Maintain ethical standards in all interactions', 'Practice regular meditation and self-inquiry']
        }
      case 'rajas':
        return {
          title: 'Rajas - Passion & Ambition',
          description: 'You are driven by passion, ambition, restlessness, and ego-driven goals. Rajas represents dynamic energy, material pursuit, and intense emotions.',
          traits: ['Strong desire for material acquisition', 'Highly reactive to criticism', 'Difficulty with stillness and patience', 'Goal-oriented and achievement-focused', 'Natural leadership tendencies', 'Seeks stimulating experiences'],
          areas: ['Practice mindfulness to balance intense emotions', 'Learn to find contentment in the present moment', 'Channel ambition toward service of others', 'Develop patience through meditation', 'Balance activity with periods of rest']
        }
      case 'tamas':
        return {
          title: 'Tamas - Inertia & Resistance',
          description: 'You tend toward inertia, apathy, resistance to change, and lethargy. Tamas represents stability but also mental fog and avoidance patterns.',
          traits: ['Tendency to avoid emotional challenges', 'Struggles with motivation and drive', 'Resistant to new information or change', 'Prone to idleness and sluggishness', 'Pessimistic worldview', 'Seeks immediate gratification'],
          areas: ['Set small, achievable daily goals', 'Practice gradual exposure to positive change', 'Engage in uplifting activities and relationships', 'Develop self-compassion while working on growth', 'Use your stability to support others growth']
        }
      default:
        return {
          title: 'Balanced Nature',
          description: 'You show a balanced mix of all three gunas.',
          traits: [],
          areas: []
        }
    }
  }

  const dominant = getGunaDescription(result.dominantGuna)
  const color = getGunaColor(result.dominantGuna)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

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
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Results Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${color}-100 mb-4`}>
            {getGunaIcon(result.dominantGuna)}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personality Results</h1>
          <p className="text-xl text-gray-600">
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Dominant Guna Card */}
        <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6 mb-8`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold text-${color}-900 mb-4`}>
              {dominant.title}
            </h2>
            <p className={`text-lg text-${color}-800 mb-6`}>
              {dominant.description}
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Your Guna Scores
          </h3>
          
          <div className="space-y-6">
            {/* Sattva */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">Sattva (Harmony)</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {Math.round(result.scores.sattva)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${result.scores.sattva}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Balance, wisdom, purity, and spiritual growth
              </p>
            </div>

            {/* Rajas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-semibold text-gray-900">Rajas (Activity)</span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  {Math.round(result.scores.rajas)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-red-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${result.scores.rajas}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Energy, passion, ambition, and dynamic change
              </p>
            </div>

            {/* Tamas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-900">Tamas (Stability)</span>
                </div>
                <span className="text-xl font-bold text-gray-600">
                  {Math.round(result.scores.tamas)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gray-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${result.scores.tamas}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Stability, rest, preservation, and groundedness
              </p>
            </div>
          </div>
        </div>

        {/* Personality Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className={`text-xl font-bold text-${color}-900 mb-4 flex items-center`}>
              <TrendingUp className="h-5 w-5 mr-2" />
              Your Strengths
            </h3>
            <ul className="space-y-2">
              {dominant.traits.map((trait, index) => (
                <li key={index} className="flex items-start">
                  <div className={`w-2 h-2 bg-${color}-500 rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                  <span className="text-gray-700">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Growth Opportunities
            </h3>
            <ul className="space-y-2">
              {dominant.areas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Sattva Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2" />
            Path to Enhanced Sattva
          </h3>
          <p className="text-blue-800 mb-6">
            Regardless of your current dominant guna, cultivating Sattva brings greater peace, wisdom, and fulfillment to life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Daily Practices</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Morning meditation or reflection</li>
                <li>• Mindful eating of fresh, natural foods</li>
                <li>• Regular exercise in nature</li>
                <li>• Evening gratitude practice</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Mindset Shifts</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Focus on service to others</li>
                <li>• Cultivate inner peace over external success</li>
                <li>• Practice patience and compassion</li>
                <li>• Seek wisdom through learning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recommendations"
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Target className="h-5 w-5 mr-2" />
            View Personalized Recommendations
          </Link>
          
          <Link
            href="/test"
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Brain className="h-5 w-5 mr-2" />
            Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}