'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Play, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react'

interface ABTestResult {
  id: string
  input: string
  outputA: string
  outputB: string
  winner: string
  ratingA: number
  ratingB: number
  createdAt: string
}

interface ABTestStatistics {
  totalTests: number
  aWins: number
  bWins: number
  ties: number
  aWinRate: number
  bWinRate: number
  tieRate: number
  avgRatingA: number
  avgRatingB: number
  overallWinner: string
  confidenceLevel: number
}

export default function ABTestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [test, setTest] = useState<any>(null)
  const [results, setResults] = useState<ABTestResult[]>([])
  const [statistics, setStatistics] = useState<ABTestStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchTestDetails()
  }, [params.id])

  const fetchTestDetails = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch(`/api/ab-tests/${params.id}/results`, { headers })
      if (response.ok) {
        const data = await response.json()
        setTest(data.test)
        setResults(data.results)
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Error fetching test details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunTest = async () => {
    if (!testInput.trim()) {
      alert('Please enter test input')
      return
    }

    setRunning(true)
    try {
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch(`/api/ab-tests/${params.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          testInputs: [testInput],
          model: 'gpt-3.5-turbo',
          temperature: 0.7
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Test results:', result)
        alert(`Test completed! Winner: ${result.summary.overallWinner}`)
        setTestInput('')
        fetchTestDetails() // Refresh data
      } else {
        const error = await response.json()
        alert(error.error || 'Test failed')
      }
    } catch (error) {
      console.error('Error running test:', error)
      alert('Failed to run test. Please try again.')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
        </div>
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Loading test details...</h3>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Not Found</h1>
          </div>
        </div>
        <Card className="text-center py-16">
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Test not found</h3>
            <p className="text-muted-foreground">The A/B test you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
            <p className="text-muted-foreground">{test.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            test.status === 'RUNNING' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : test.status === 'COMPLETED'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {test.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Test Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{statistics.aWins}</div>
                      <div className="text-sm text-muted-foreground">A Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{statistics.bWins}</div>
                      <div className="text-sm text-muted-foreground">B Wins</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">A Win Rate:</span>
                      <span className="text-sm font-medium">{statistics.aWinRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">B Win Rate:</span>
                      <span className="text-sm font-medium">{statistics.bWinRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confidence:</span>
                      <span className="text-sm font-medium">{statistics.confidenceLevel.toFixed(1)}%</span>
                    </div>
                  </div>

                  {statistics.overallWinner && (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Winner: Version {statistics.overallWinner}
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Test */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Test</CardTitle>
              <CardDescription>
                Test both prompts with a single input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Test Input</label>
                <Textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input..."
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleRunTest} 
                disabled={running || !testInput.trim()}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {running ? 'Running Test...' : 'Run Test'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Detailed results from all test runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No test results yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={result.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Test #{index + 1}</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.winner === 'A' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : result.winner === 'B'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {result.winner === 'TIE' ? 'TIE' : `Winner: ${result.winner}`}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Input:</label>
                            <div className="p-2 bg-muted rounded text-sm">{result.input}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Version A:</label>
                              <div className="p-2 bg-muted rounded text-sm max-h-20 overflow-y-auto">
                                {result.outputA}
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs">{result.ratingA?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Version B:</label>
                              <div className="p-2 bg-muted rounded text-sm max-h-20 overflow-y-auto">
                                {result.outputB}
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs">{result.ratingB?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 