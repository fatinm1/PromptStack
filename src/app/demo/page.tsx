'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { 
  ArrowLeft,
  Code, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Sparkles,
  Rocket,
  CheckCircle,
  GitBranch,
  Activity,
  Target,
  Lightbulb,
  MessageSquare,
  GitPullRequest,
  Database,
  Cpu,
  Globe,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function DemoPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('prompt-editor')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const handleBack = () => {
    router.push('/')
  }

  const handleGetStarted = () => {
    router.push('/auth/signup')
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const runTest = () => {
    if (!testInput.trim()) return
    
    setIsTesting(true)
    setTimeout(() => {
      setTestResult(`Thank you for your inquiry about "${testInput}". I understand your concern and I'm here to help. Let me provide you with a detailed solution to address this issue. I'll make sure to follow up with you within 24 hours to ensure everything is resolved to your satisfaction.`)
      setIsTesting(false)
    }, 2000)
  }

  const tabs = [
    { id: 'prompt-editor', name: 'Prompt Editor', icon: Code },
    { id: 'ab-testing', name: 'A/B Testing', icon: GitPullRequest },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'team', name: 'Team Collaboration', icon: Users },
    { id: 'version-control', name: 'Version Control', icon: GitBranch }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Logo size="md" showText={true} />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
            <Button size="sm" onClick={handleGetStarted} className="group">
              Get Started
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Interactive Demo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            Experience PromptStack
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the powerful features that make PromptStack the ultimate platform for prompt engineering and AI development.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </Button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'prompt-editor' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Prompt Editor
                    </CardTitle>
                    <CardDescription>
                      Create and test prompts with real-time AI integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt Name</label>
                      <Input value="Customer Service Assistant" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <Input value="GPT-4" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Temperature</label>
                      <Input value="0.7" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt Content</label>
                      <Textarea 
                        value={`You are a helpful customer service assistant for TechCorp. Your role is to help customers with technical issues and provide excellent support.

Customer query: {customer_query}

Please provide a helpful, professional response that:
- Addresses the customer's concern directly
- Offers a clear solution or next steps
- Maintains a friendly, professional tone
- Includes follow-up information if needed

Response:`}
                        rows={8}
                        readOnly
                        className="font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Test Your Prompt</CardTitle>
                    <CardDescription>
                      Try the prompt with different inputs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Input</label>
                      <Input 
                        placeholder="Enter a test query..."
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={runTest} 
                      disabled={!testInput.trim() || isTesting}
                      className="w-full"
                    >
                      {isTesting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Test Prompt
                        </>
                      )}
                    </Button>
                    {testResult && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">AI Response:</h4>
                        <p className="text-sm text-muted-foreground">{testResult}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Real-time performance tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">99.2%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1.8s</div>
                        <div className="text-sm text-muted-foreground">Avg Latency</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">$0.004</div>
                        <div className="text-sm text-muted-foreground">Cost/Test</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                        <div className="text-sm text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>
                      Connect your AI models
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          value="sk-1234567890abcdef..."
                          readOnly
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Supported Models</label>
                      <div className="flex flex-wrap gap-2">
                        {['GPT-4', 'GPT-3.5-turbo', 'Claude-3', 'Claude-2'].map((model) => (
                          <span key={model} className="px-2 py-1 bg-muted rounded text-xs">
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'ab-testing' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GitPullRequest className="w-5 h-5 mr-2" />
                      A/B Testing Setup
                    </CardTitle>
                    <CardDescription>
                      Compare different prompt versions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Name</label>
                      <Input value="Customer Service A/B Test" readOnly />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Version A</label>
                        <Input value="Formal Tone" readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Version B</label>
                        <Input value="Friendly Tone" readOnly />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Inputs</label>
                      <Textarea 
                        value={`"My order hasn't arrived yet"
"I want to cancel my subscription"
"Your product doesn't work as advertised"
"Can you help me with a refund?"`}
                        rows={4}
                        readOnly
                        className="font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription>
                      Real-time comparison results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Version A (Formal)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">67%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Version B (Friendly)</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">83%</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-600">Winner: Version B</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Version B shows 16% better performance across all test cases
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistical Analysis</CardTitle>
                    <CardDescription>
                      Detailed performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Confidence Level</div>
                        <div className="text-2xl font-bold text-green-600">95%</div>
                      </div>
                      <div>
                        <div className="font-medium">Sample Size</div>
                        <div className="text-2xl font-bold text-blue-600">1,247</div>
                      </div>
                      <div>
                        <div className="font-medium">Cost Savings</div>
                        <div className="text-2xl font-bold text-purple-600">23%</div>
                      </div>
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-2xl font-bold text-orange-600">-12%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                        <p className="text-2xl font-bold">12,847</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">99.2%</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                        <p className="text-2xl font-bold text-purple-600">$1,247</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                        <p className="text-2xl font-bold text-orange-600">4.8/5</p>
                      </div>
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                    <CardDescription>
                      Monthly spending breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>GPT-4 Usage</span>
                        <span className="font-medium">$847</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GPT-3.5 Usage</span>
                        <span className="font-medium">$234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Claude Usage</span>
                        <span className="font-medium">$166</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between font-bold">
                          <span>Total</span>
                          <span>$1,247</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>
                      Success rate over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>This Week</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">99.2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Week</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">98.7%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Month</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">97.8%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Team Members
                    </CardTitle>
                    <CardDescription>
                      Collaborate with your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">S</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Sarah Chen</div>
                          <div className="text-sm text-muted-foreground">AI Engineer</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">M</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Mike Rodriguez</div>
                          <div className="text-sm text-muted-foreground">Lead Developer</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Alex Thompson</div>
                          <div className="text-sm text-muted-foreground">CTO</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Offline</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Team collaboration timeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">Sarah</span> updated the customer service prompt</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">Mike</span> approved the A/B test results</p>
                          <p className="text-xs text-muted-foreground">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">Alex</span> created a new project</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Collaboration</CardTitle>
                    <CardDescription>
                      Real-time editing features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">customer-service-prompt.md</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600">3 people editing</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-blue-600">You are a helpful customer service assistant...</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-600">Please provide a professional response...</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-purple-600">Include follow-up information...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Permissions</CardTitle>
                    <CardDescription>
                      Role-based access control
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sarah Chen</span>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">Editor</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mike Rodriguez</span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded">Admin</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Alex Thompson</span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 px-2 py-1 rounded">Owner</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'version-control' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GitBranch className="w-5 h-5 mr-2" />
                      Version History
                    </CardTitle>
                    <CardDescription>
                      Track changes and manage versions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">v1.2 - Improved tone</div>
                            <div className="text-sm text-muted-foreground">Updated customer service prompt with friendlier tone</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Sarah Chen</div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <GitBranch className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">v1.1 - Added follow-up</div>
                            <div className="text-sm text-muted-foreground">Added follow-up information to responses</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Mike Rodriguez</div>
                          <div className="text-xs text-muted-foreground">1 day ago</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                            <Code className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">v1.0 - Initial version</div>
                            <div className="text-sm text-muted-foreground">Created basic customer service prompt</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Alex Thompson</div>
                          <div className="text-xs text-muted-foreground">3 days ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Management</CardTitle>
                    <CardDescription>
                      Create and manage branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">main</span>
                        </div>
                        <span className="text-sm text-muted-foreground">v1.2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">feature/friendly-tone</span>
                        </div>
                        <span className="text-sm text-muted-foreground">v1.3-beta</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">hotfix/urgent-fix</span>
                        </div>
                        <span className="text-sm text-muted-foreground">v1.1.1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Diff View</CardTitle>
                    <CardDescription>
                      Compare changes between versions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex">
                        <div className="w-8 text-gray-500">1</div>
                        <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-1">
                          <span className="text-red-600">- You are a helpful customer service assistant.</span>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-8 text-gray-500">1</div>
                        <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-1">
                          <span className="text-green-600">+ You are a friendly and helpful customer service assistant.</span>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-8 text-gray-500">2</div>
                        <div className="flex-1 p-1">
                          <span>Your role is to help customers with technical issues.</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border-promptstack-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of developers and teams already using PromptStack to build better AI applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleGetStarted} className="group">
                  <Rocket className="mr-2 w-5 h-5" />
                  Start Building
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleSignIn}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 