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
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [promptContent, setPromptContent] = useState(`You are a helpful customer service assistant for TechCorp. Your role is to help customers with technical issues and provide excellent support.

Customer query: {customer_query}

Please provide a helpful, professional response that:
- Addresses the customer's concern directly
- Offers a clear solution or next steps
- Maintains a friendly, professional tone
- Includes follow-up information if needed

Response:`)
  const [abTestResults, setAbTestResults] = useState([
    { version: 'A', wins: 67, losses: 33, avgRating: 4.2, cost: 0.004 },
    { version: 'B', wins: 83, losses: 17, avgRating: 4.8, cost: 0.003 }
  ])
  const [analyticsData, setAnalyticsData] = useState({
    totalTests: 1247,
    successRate: 99.2,
    avgLatency: 1.8,
    totalCost: 1247,
    avgRating: 4.8
  })
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Sarah Chen', role: 'AI Engineer', status: 'online', avatar: 'S', color: 'from-blue-500 to-purple-500' },
    { name: 'Mike Rodriguez', role: 'Lead Developer', status: 'online', avatar: 'M', color: 'from-green-500 to-blue-500' },
    { name: 'Alex Thompson', role: 'CTO', status: 'offline', avatar: 'A', color: 'from-purple-500 to-pink-500' },
    { name: 'Emma Wilson', role: 'Product Manager', status: 'online', avatar: 'E', color: 'from-orange-500 to-red-500' }
  ])
  const [versionHistory, setVersionHistory] = useState([
    { version: 'v1.2', author: 'Sarah Chen', date: '2 hours ago', changes: 'Improved tone and added follow-up information', status: 'merged' },
    { version: 'v1.1', author: 'Mike Rodriguez', date: '1 day ago', changes: 'Added error handling and better formatting', status: 'merged' },
    { version: 'v1.0', author: 'Alex Thompson', date: '3 days ago', changes: 'Initial customer service prompt', status: 'merged' }
  ])

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
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptrix-primary/10 to-promptrix-secondary/10 border border-promptrix-primary/20 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-promptrix-primary" />
          <span className="text-sm font-medium text-promptrix-primary">Interactive Demo</span>
        </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Experience Promptrix
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Explore the powerful features that make Promptrix the ultimate platform for prompt engineering and AI development.
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
                      Advanced Prompt Editor
                    </CardTitle>
                    <CardDescription>
                      Create, test, and optimize prompts with real-time AI integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt Name</label>
                      <Input value="Customer Service Assistant" readOnly />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">AI Model</label>
                        <select 
                          value={selectedModel} 
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <optgroup label="OpenAI Models">
                            <option value="gpt-4o">GPT-4o (Latest & Most Capable)</option>
                            <option value="gpt-4o-mini">GPT-4o Mini (Fast & Affordable)</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
                            <option value="gpt-4">GPT-4 (High Quality)</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Cheap)</option>
                          </optgroup>
                          <optgroup label="Anthropic Models">
                            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Latest)</option>
                            <option value="claude-3-5-haiku">Claude 3.5 Haiku (Fast)</option>
                            <option value="claude-3-opus">Claude 3 Opus (Most Powerful)</option>
                            <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                            <option value="claude-3-haiku">Claude 3 Haiku (Lightweight)</option>
                          </optgroup>
                          <optgroup label="Google Models">
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Advanced)</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                            <option value="gemini-pro">Gemini Pro (Standard)</option>
                          </optgroup>
                          <optgroup label="Meta Models">
                            <option value="llama-3.1-405b">Llama 3.1 405B (Largest)</option>
                            <option value="llama-3.1-70b">Llama 3.1 70B (Balanced)</option>
                            <option value="llama-3.1-8b">Llama 3.1 8B (Fast)</option>
                          </optgroup>
                          <optgroup label="Mistral Models">
                            <option value="mistral-large">Mistral Large (High Quality)</option>
                            <option value="mistral-medium">Mistral Medium (Balanced)</option>
                            <option value="mistral-small">Mistral Small (Fast)</option>
                          </optgroup>
                          <optgroup label="Cohere Models">
                            <option value="command-r-plus">Command R+ (Advanced)</option>
                            <option value="command-r">Command R (Standard)</option>
                            <option value="command-light">Command Light (Fast)</option>
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Temperature</label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Focused ({temperature})</span>
                            <span>Creative</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Tokens</label>
                      <Input 
                        type="number"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        min="1"
                        max="4000"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Prompt Content</label>
                      <Textarea 
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                        placeholder="Enter your prompt template here..."
                      />
                      <div className="mt-2 text-xs text-muted-foreground">
                        Use {'{variable}'} syntax for dynamic inputs. Available variables: customer_query, user_name, product_name
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Estimated cost: $0.004 per test • Tokens: ~247
                      </div>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Testing</CardTitle>
                    <CardDescription>
                      Test your prompt with real AI responses
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
                      <div className="mt-2 text-xs text-muted-foreground">
                        Try: "My order hasn't arrived yet" or "I want to cancel my subscription"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTestInput("My order hasn't arrived yet")}
                      >
                        Order Issue
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTestInput("I want to cancel my subscription")}
                      >
                        Cancellation
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTestInput("Your product doesn't work as advertised")}
                      >
                        Product Complaint
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTestInput("Can you help me with a refund?")}
                      >
                        Refund Request
                      </Button>
                    </div>

                    <Button 
                      onClick={runTest} 
                      disabled={!testInput.trim() || isTesting}
                      className="w-full"
                    >
                      {isTesting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Testing with {selectedModel}...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Test Prompt
                        </>
                      )}
                    </Button>

                    {testResult && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">AI Response:</h4>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>Model: {selectedModel}</span>
                              <span>•</span>
                              <span>Temp: {temperature}</span>
                              <span>•</span>
                              <span>1.8s</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{testResult}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span>Cost: $0.004</span>
                            <span>Tokens: 247</span>
                            <span>Rating: 4.8/5 ⭐⭐⭐⭐⭐</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="text-lg font-bold text-green-600">4.8</div>
                            <div className="text-xs text-muted-foreground">Quality</div>
                          </div>
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="text-lg font-bold text-blue-600">1.8s</div>
                            <div className="text-xs text-muted-foreground">Latency</div>
                          </div>
                          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <div className="text-lg font-bold text-purple-600">$0.004</div>
                            <div className="text-xs text-muted-foreground">Cost</div>
                          </div>
                        </div>
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
                      A/B Testing Configuration
                    </CardTitle>
                    <CardDescription>
                      Set up comprehensive prompt comparison tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Name</label>
                      <Input value="Customer Service Tone Optimization" readOnly />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Version A (Control)</label>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm font-medium mb-1">Formal Professional Tone</div>
                          <div className="text-xs text-muted-foreground">Traditional customer service approach</div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Version B (Variant)</label>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm font-medium mb-1">Friendly Conversational Tone</div>
                          <div className="text-xs text-muted-foreground">Modern, approachable style</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Parameters</label>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Sample Size</div>
                          <div className="text-muted-foreground">1,000 tests</div>
                        </div>
                        <div>
                          <div className="font-medium">Confidence Level</div>
                          <div className="text-muted-foreground">95%</div>
                        </div>
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-muted-foreground">7 days</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Test Inputs</label>
                      <Textarea 
                        value={`"My order hasn't arrived yet"
"I want to cancel my subscription"
"Your product doesn't work as advertised"
"Can you help me with a refund?"
"I'm having trouble with your website"
"The item I received is damaged"
"I need help with my account"
"Your customer service is terrible"`}
                        rows={6}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <div className="mt-2 text-xs text-muted-foreground">
                        8 different customer scenarios for comprehensive testing
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Estimated cost: $32.00 • Duration: 7 days
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Run Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehensive Test Results</CardTitle>
                    <CardDescription>
                      Detailed statistical analysis and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Performance Comparison */}
                      <div>
                        <h4 className="font-medium mb-3">Performance Comparison</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="font-medium">Version A (Formal)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full">
                                <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                              <span className="text-sm font-medium">67%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-medium">Version B (Friendly)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full">
                                <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <span className="text-sm font-medium">83%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Version A Metrics</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Win Rate:</span>
                              <span className="font-medium">67%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avg Rating:</span>
                              <span className="font-medium">4.2/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avg Cost:</span>
                              <span className="font-medium">$0.004</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Response Time:</span>
                              <span className="font-medium">2.1s</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Version B Metrics</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Win Rate:</span>
                              <span className="font-medium text-green-600">83%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avg Rating:</span>
                              <span className="font-medium text-green-600">4.8/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avg Cost:</span>
                              <span className="font-medium text-green-600">$0.003</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Response Time:</span>
                              <span className="font-medium text-green-600">1.8s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Winner Analysis */}
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-600">Winner: Version B (Friendly)</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            Version B shows statistically significant improvements across all metrics:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>16% higher win rate (83% vs 67%)</li>
                            <li>14% better average rating (4.8 vs 4.2)</li>
                            <li>25% lower cost per response ($0.003 vs $0.004)</li>
                            <li>14% faster response time (1.8s vs 2.1s)</li>
                          </ul>
                        </div>
                      </div>

                      {/* Statistical Significance */}
                      <div>
                        <h5 className="font-medium mb-2">Statistical Analysis</h5>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="text-lg font-bold text-blue-600">95%</div>
                            <div className="text-xs text-muted-foreground">Confidence</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="text-lg font-bold text-green-600">1,000</div>
                            <div className="text-xs text-muted-foreground">Sample Size</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <div className="text-lg font-bold text-purple-600">7 days</div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                        </div>
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
              {/* Key Metrics Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                        <p className="text-2xl font-bold">{analyticsData.totalTests.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+12% from last month</p>
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
                        <p className="text-2xl font-bold text-green-600">{analyticsData.successRate}%</p>
                        <p className="text-xs text-green-600">+0.3% from last week</p>
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
                        <p className="text-2xl font-bold text-purple-600">${analyticsData.totalCost.toLocaleString()}</p>
                        <p className="text-xs text-green-600">-8% from last month</p>
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
                        <p className="text-2xl font-bold text-orange-600">{analyticsData.avgRating}/5</p>
                        <p className="text-xs text-green-600">+0.2 from last week</p>
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
                    <CardTitle>Detailed Cost Analysis</CardTitle>
                    <CardDescription>
                      Monthly spending breakdown by model and project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-3">By AI Model</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>GPT-4o</span>
                            </div>
                            <span className="font-medium">$423 (34%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Claude 3.5 Sonnet</span>
                            </div>
                            <span className="font-medium">$312 (25%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span>Gemini 1.5 Pro</span>
                            </div>
                            <span className="font-medium">$249 (20%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span>Mistral Large</span>
                            </div>
                            <span className="font-medium">$187 (15%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Others</span>
                            </div>
                            <span className="font-medium">$76 (6%)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">By Project</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Customer Service</span>
                            <span className="font-medium">$623 (50%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Email Marketing</span>
                            <span className="font-medium">$374 (30%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Content Generation</span>
                            <span className="font-medium">$250 (20%)</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between font-bold">
                          <span>Total Monthly Cost</span>
                          <span>${analyticsData.totalCost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Avg cost per test</span>
                          <span>${(analyticsData.totalCost / analyticsData.totalTests).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>
                      Key metrics over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium mb-3">Success Rate Trend</h5>
                        <div className="space-y-3">
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
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Response Time Trend</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>This Week</span>
                            <span className="text-sm font-medium text-blue-600">1.8s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last Week</span>
                            <span className="text-sm font-medium">2.1s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last Month</span>
                            <span className="text-sm font-medium">2.4s</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Cost Efficiency</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>This Week</span>
                            <span className="text-sm font-medium text-green-600">$0.003/test</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last Week</span>
                            <span className="text-sm font-medium">$0.004/test</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last Month</span>
                            <span className="text-sm font-medium">$0.005/test</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Model Comparison Section */}
          {activeTab === 'analytics' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Model Comparison Guide</CardTitle>
                <CardDescription>
                  Compare different AI models for your use case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-3">For Speed & Cost</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>GPT-4o Mini</span>
                          <span className="text-green-600">$0.00015/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Claude 3.5 Haiku</span>
                          <span className="text-green-600">$0.00025/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gemini 1.5 Flash</span>
                          <span className="text-green-600">$0.000075/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Llama 3.1 8B</span>
                          <span className="text-green-600">$0.0002/1K</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">For Quality & Capability</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>GPT-4o</span>
                          <span className="text-blue-600">$0.005/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Claude 3.5 Sonnet</span>
                          <span className="text-blue-600">$0.003/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gemini 1.5 Pro</span>
                          <span className="text-blue-600">$0.00375/1K</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mistral Large</span>
                          <span className="text-blue-600">$0.007/1K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-3">Recommended Use Cases</h5>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-green-600">Customer Service</div>
                        <div className="text-muted-foreground">GPT-4o Mini, Claude 3.5 Haiku</div>
                      </div>
                      <div>
                        <div className="font-medium text-blue-600">Content Creation</div>
                        <div className="text-muted-foreground">GPT-4o, Claude 3.5 Sonnet</div>
                      </div>
                      <div>
                        <div className="font-medium text-purple-600">Code Generation</div>
                        <div className="text-muted-foreground">GPT-4o, Gemini 1.5 Pro</div>
                      </div>
                      <div>
                        <div className="font-medium text-orange-600">Data Analysis</div>
                        <div className="text-muted-foreground">Claude 3.5 Sonnet, Mistral Large</div>
                      </div>
                      <div>
                        <div className="font-medium text-red-600">Creative Writing</div>
                        <div className="text-muted-foreground">GPT-4o, Claude 3.5 Sonnet</div>
                      </div>
                      <div>
                        <div className="font-medium text-indigo-600">A/B Testing</div>
                        <div className="text-muted-foreground">GPT-4o Mini, Claude 3.5 Haiku</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-promptrix-primary/10 to-promptrix-secondary/10 border-promptrix-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of developers and teams already using Promptrix to build better AI applications.
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