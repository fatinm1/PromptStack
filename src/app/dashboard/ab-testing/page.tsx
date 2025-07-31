'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Plus, 
  Play, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

const mockABTests = [
  {
    id: '1',
    name: 'Email Subject Line Test',
    description: 'Testing different email subject line approaches',
    promptA: 'Subject: {{product_name}} - Limited Time Offer Inside!',
    promptB: 'Subject: Don\'t miss out on {{product_name}} savings',
    status: 'running',
    participants: 150,
    duration: '3 days',
    winner: null,
    ratingA: 4.2,
    ratingB: 3.8
  },
  {
    id: '2',
    name: 'Product Description Test',
    description: 'Comparing different product description styles',
    promptA: 'Introducing {{product_name}}: {{key_feature}}. Perfect for {{use_case}}.',
    promptB: '{{product_name}} - {{key_feature}} that {{use_case}}. Experience the difference.',
    status: 'completed',
    participants: 200,
    duration: '5 days',
    winner: 'A',
    ratingA: 4.5,
    ratingB: 4.1
  }
]

export default function ABTestingPage() {
  const [selectedTest, setSelectedTest] = React.useState<string | null>(null)
  const [testInput, setTestInput] = React.useState('')
  const [isRunning, setIsRunning] = React.useState(false)

  const handleRunTest = () => {
    setIsRunning(true)
    // Simulate API call
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing</h1>
          <p className="text-muted-foreground">
            Compare prompt versions and find the best performing ones
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New A/B Test
        </Button>
      </div>

      {/* Active Tests */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockABTests.map((test) => (
          <Card key={test.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-promptstack-primary" />
                    {test.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {test.description}
                  </CardDescription>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  test.status === 'running' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {test.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{test.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{test.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{test.ratingA} vs {test.ratingB}</span>
                  </div>
                </div>

                {/* Winner */}
                {test.winner && (
                  <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Winner: Version {test.winner}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTest(test.id)}
                  >
                    View Details
                  </Button>
                  {test.status === 'running' && (
                    <Button size="sm" disabled>
                      <Play className="w-4 h-4 mr-2" />
                      Running
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Runner */}
      {selectedTest && (
        <Card>
          <CardHeader>
            <CardTitle>Test Runner</CardTitle>
            <CardDescription>
              Compare prompt versions side by side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Test Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">Test Input</label>
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input..."
                />
              </div>

              {/* Side by Side Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Version A */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Version A</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-md text-sm font-mono">
                        Subject: Product Name - Limited Time Offer Inside!
                      </div>
                      
                      {isRunning ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-promptstack-primary"></div>
                        </div>
                      ) : (
                        <div className="p-3 bg-background border rounded-md text-sm">
                          Generated output will appear here...
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button key={star} variant="ghost" size="sm">
                              <Star className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Version B */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Version B</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-md text-sm font-mono">
                        Subject: Don't miss out on Product Name savings
                      </div>
                      
                      {isRunning ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-promptstack-primary"></div>
                        </div>
                      ) : (
                        <div className="p-3 bg-background border rounded-md text-sm">
                          Generated output will appear here...
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button key={star} variant="ghost" size="sm">
                              <Star className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Run Test Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleRunTest} 
                  disabled={isRunning || !testInput}
                  size="lg"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isRunning ? 'Running Test...' : 'Run Test'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 