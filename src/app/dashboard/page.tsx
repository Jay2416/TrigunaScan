'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Brain, User, BarChart3, Target, LogOut, Play } from 'lucide-react'
import { TestResult } from '@/types'
import GunaDropdown from '@/components/GunaDropdown'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      checkTestStatus()
    }
  }, [session, status, router])

  const checkTestStatus = async () => {
    try {
      const response = await fetch('/api/test/status')
      if (response.ok) {
        const data = await response.json()
        setTestResult(data.result)
      }
    } catch (error) {
      console.error('Error checking test status:', error)
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TriguṇāScan</span>
            </div>
            
            <div className="flex items-center">
              <GunaDropdown />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Personality Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover your Sattva, Rajas, and Tamas nature
            </p>
          </div>

          {!testResult ? (
            /* Test Not Taken */
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-indigo-100 mb-6">
                  <Brain className="h-16 w-16 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Discover Your Personality?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Take our comprehensive personality assessment to understand your Sattva, Rajas, and Tamas nature. 
                  The test takes about 10-15 minutes and will provide you with detailed insights about your personality 
                  and recommendations for personal growth.
                </p>
                <Link
                  href="/test"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Personality Test
                </Link>
              </div>
            </div>
          ) : (
            /* Test Results */
            <div className="space-y-6">
              {/* Results Overview */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Personality Profile</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Test Completed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sattva Score */}
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-900">Sattva</h3>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round((testResult.scores.sattva / 100) * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(testResult.scores.sattva / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">
                        Harmony, balance, and wisdom
                      </p>
                    </div>

                    {/* Rajas Score */}
                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-red-900">Rajas</h3>
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round((testResult.scores.rajas / 100) * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-3">
                        <div 
                          className="bg-red-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(testResult.scores.rajas / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-red-700 mt-2">
                        Activity, passion, and change
                      </p>
                    </div>

                    {/* Tamas Score */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tamas</h3>
                        <div className="text-2xl font-bold text-gray-600">
                          {Math.round((testResult.scores.tamas / 100) * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gray-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(testResult.scores.tamas / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Inertia, stability, and rest
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-indigo-900 mb-2">
                      Your Dominant Guna: {testResult.dominantGuna.charAt(0).toUpperCase() + testResult.dominantGuna.slice(1)}
                    </h4>
                    <p className="text-indigo-800">
                      {testResult.dominantGuna === 'sattva' && 
                        "You tend toward harmony, balance, and wisdom in your approach to life."
                      }
                      {testResult.dominantGuna === 'rajas' && 
                        "You tend toward activity, passion, and dynamic change in your approach to life."
                      }
                      {testResult.dominantGuna === 'tamas' && 
                        "You tend toward stability, rest, and maintaining the status quo in your approach to life."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/results"
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    View comprehensive insights about your personality profile and behavioral patterns.
                  </p>
                  <span className="text-indigo-600 font-medium">View Details →</span>
                </Link>

                <Link
                  href="/recommendations"
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Growth Recommendations</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get personalized suggestions to enhance your Sattva nature and achieve better balance.
                  </p>
                  <span className="text-green-600 font-medium">View Recommendations →</span>
                </Link>
              </div>

              {/* Retake Test */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Want to Retake the Test?</h3>
                    <p className="text-purple-700">
                      Your personality can evolve over time. Discover how your gunas have shifted with a fresh assessment.
                    </p>
                  </div>
                  <Link
                    href="/test"
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Retake Assessment
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}