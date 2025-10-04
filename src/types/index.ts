export interface User {
  _id: string
  email: string
  name: string
  password?: string
  hasCompletedTest: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  text: string
  category: 'sattva' | 'rajas' | 'tamas'
  reverseScored?: boolean
}

export interface TestResponse {
  questionId: string
  value: number // 1-5 (strongly disagree to strongly agree)
}

export interface TestResult {
  _id?: string
  userId: string
  responses: TestResponse[]
  scores: {
    sattva: number
    rajas: number
    tamas: number
  }
  dominantGuna: 'sattva' | 'rajas' | 'tamas'
  completedAt: Date
  llmAnalysis?: string
  recommendations?: string[]
}

export interface PersonalityInsight {
  category: string
  description: string
  strengths: string[]
  improvementAreas: string[]
  recommendations: string[]
}