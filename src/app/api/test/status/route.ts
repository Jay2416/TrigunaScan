import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const testResults = client.db().collection('testResults')
    
    // Find the latest test result for the user
    const result = await testResults.findOne(
      { userEmail: session.user.email },
      { sort: { completedAt: -1 } }
    )

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error checking test status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}