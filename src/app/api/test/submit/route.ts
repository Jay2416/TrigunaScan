import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { personalityQuestions } from '@/data/questions'
import { TestResponse } from '@/types'

function calculateScores(responses: TestResponse[]) {
  const rawScores = {
    sattva: 0,
    rajas: 0,
    tamas: 0
  }

  const counts = {
    sattva: 0,
    rajas: 0,  
    tamas: 0
  }

  // Sum up raw scores for each guna
  responses.forEach(response => {
    const question = personalityQuestions.find(q => q.id === response.questionId)
    if (question) {
      rawScores[question.category] += response.value
      counts[question.category]++
    }
  })

  // Validate that we have exactly 8 questions per guna (24 total)
  const expectedQuestionsPerGuna = 8
  if (counts.sattva !== expectedQuestionsPerGuna || 
      counts.rajas !== expectedQuestionsPerGuna || 
      counts.tamas !== expectedQuestionsPerGuna) {
    console.warn('Question count mismatch:', counts)
  }

  // Calculate Guna Percentage Score (GPS): (rawScore / 40) * 100
  // Maximum possible raw score per guna: 8 questions * 5 points = 40
  const gpsScores = {
    sattva: (rawScores.sattva / 40) * 100,
    rajas: (rawScores.rajas / 40) * 100,
    tamas: (rawScores.tamas / 40) * 100
  }

  // Determine dominant guna (highest GPS)
  const dominant = Object.entries(gpsScores).reduce((a, b) => 
    gpsScores[a[0] as keyof typeof gpsScores] > gpsScores[b[0] as keyof typeof gpsScores] ? a : b
  )[0] as 'sattva' | 'rajas' | 'tamas'

  return {
    scores: gpsScores,
    rawScores: rawScores,
    dominantGuna: dominant
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { responses } = await request.json()
    
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { message: 'Invalid responses data' },
        { status: 400 }
      )
    }

    // Expect exactly 24 responses (8 per guna)
    if (responses.length !== 24) {
      return NextResponse.json(
        { message: `Incomplete test responses. Expected 24, got ${responses.length}` },
        { status: 400 }
      )
    }

    // Calculate scores
    const result = calculateScores(responses)

    const testResult = {
      userId: session.user.id,
      userEmail: session.user.email,
      responses,
      scores: result.scores,
      dominantGuna: result.dominantGuna,
      completedAt: new Date(),
    }

    const client = await clientPromise
    const testResults = client.db().collection('testResults')
    
    // Insert test result
    const insertResult = await testResults.insertOne(testResult)

    // Update user's hasCompletedTest status
    const users = client.db().collection('users')
    await users.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          hasCompletedTest: true,
          updatedAt: new Date()
        }
      }
    )

    // Send to Python API for LLM analysis (non-blocking)
    try {
      const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
      await fetch(`${pythonApiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultId: insertResult.insertedId.toString(),
          scores: result.scores,
          dominantGuna: result.dominantGuna,
          responses: responses.map(r => ({
            questionId: r.questionId,
            questionText: personalityQuestions.find(q => q.id === r.questionId)?.text,
            category: personalityQuestions.find(q => q.id === r.questionId)?.category,
            value: r.value
          }))
        }),
      })
    } catch (llmError) {
      console.error('Error calling Python API for LLM analysis:', llmError)
      // Don't fail the main request if LLM analysis fails
    }

    return NextResponse.json({
      message: 'Test submitted successfully',
      result: {
        ...testResult,
        _id: insertResult.insertedId
      }
    })
  } catch (error) {
    console.error('Error submitting test:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}