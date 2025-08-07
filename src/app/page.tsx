'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { TypingAnimation } from '@/components/typing-animation'
import { AdvancedTypingAnimation } from '@/components/advanced-typing-animation'
import { ClientOnly } from '@/components/client-only'
import { 
  GitBranch, 
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
  Globe,
  Cpu,
  Database,
  GitPullRequest,
  Activity,
  Target,
  Lightbulb,
  MessageSquare
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-promptstack-primary/20 to-promptstack-secondary/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  )
}

// Animated gradient background
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-to-r from-promptstack-primary/5 via-transparent to-promptstack-secondary/5 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-promptstack-primary/10 to-transparent animate-pulse" />
    </div>
  )
}

// Stats component
function StatsSection() {
  const [stats, setStats] = useState([
    { label: 'Teams', value: '500+', icon: Users },
    { label: 'Prompts', value: '10K+', icon: Code },
    { label: 'Tests', value: '50K+', icon: Target },
    { label: 'Success Rate', value: '99.9%', icon: CheckCircle }
  ])

  return (
    <ClientOnly fallback={
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="h-6 w-6 bg-muted rounded mx-auto mb-2"></div>
            <div className="h-8 bg-muted rounded w-16 mx-auto mb-1"></div>
            <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>
    }>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="text-center animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-center mb-2">
              <stat.icon className="w-6 h-6 text-promptstack-primary" />
            </div>
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </ClientOnly>
  )
}

// Interactive demo preview
function DemoPreview() {
  const [activeTab, setActiveTab] = useState(0)
  const demoTabs = [
    { name: 'Prompt Editor', icon: Code },
    { name: 'A/B Testing', icon: GitPullRequest },
    { name: 'Analytics', icon: BarChart3 }
  ]

  return (
    <ClientOnly fallback={
      <div className="relative mt-16 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
        <div className="h-64 bg-background/80 rounded-lg border border-border/50 p-4 flex items-center justify-center">
          <div className="text-muted-foreground">Loading demo...</div>
        </div>
      </div>
    }>
      <div className="relative mt-16 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
        <div className="flex space-x-1 mb-4">
          {demoTabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === index 
                  ? 'bg-promptstack-primary text-white' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="h-64 bg-background/80 rounded-lg border border-border/50 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          {activeTab === 0 && (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          )}
          
          {activeTab === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 bg-green-200 rounded w-full"></div>
                <div className="h-3 bg-green-200 rounded w-3/4"></div>
                <div className="h-3 bg-green-200 rounded w-5/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-blue-200 rounded w-full"></div>
                <div className="h-3 bg-blue-200 rounded w-2/3"></div>
                <div className="h-3 bg-blue-200 rounded w-4/5"></div>
              </div>
            </div>
          )}
          
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded"></div>
              <div className="h-8 bg-gradient-to-r from-promptstack-secondary to-promptstack-primary rounded"></div>
              <div className="h-8 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded"></div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/signup')
    }
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  const handleWatchDemo = () => {
    router.push('/demo')
  }

  const handlePricing = () => {
    // Scroll to pricing section or show pricing modal
    if (typeof window !== 'undefined') {
      const pricingSection = document.getElementById('pricing')
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        alert('Pricing information coming soon!')
      }
    } else {
      alert('Pricing information coming soon!')
    }
  }

  const handleDocs = () => {
    // Open documentation or show docs modal
    alert('Documentation will open in a new tab!')
  }

  return (
    <ClientOnly fallback={
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedGradient />
        <FloatingParticles />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedGradient />
        <FloatingParticles />
      
      {/* Header */}
      <header className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" showText={true} />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <button onClick={handlePricing} className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
            <button onClick={handleDocs} className="text-sm font-medium hover:text-primary transition-colors">Docs</button>
            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
            <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
            <Button size="sm" onClick={handleGetStarted} className="group">
              Get Started
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center z-10 overflow-hidden">
        {/* Linear-style gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-promptstack-primary/20 to-promptstack-secondary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">The Future of Prompt Engineering</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-in leading-tight">
            <span className="linear-gradient-text">GitHub</span>
            <br />
            <span className="text-foreground">for LLM Prompts</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            <ClientOnly>
              <AdvancedTypingAnimation 
                lines={[
                  "Collaborate, version control, and test your LLM prompts with the power of Git-like workflows.",
                  "Build better AI applications together with enterprise-grade tools and analytics."
                ]}
                speed={50}
                delay={2000}
                className="text-xl md:text-2xl text-muted-foreground"
              />
            </ClientOnly>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="group linear-button bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90 text-white linear-shadow hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg font-semibold" onClick={handleGetStarted}>
              <Rocket className="mr-3 w-6 h-6" />
              Start Building
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleWatchDemo} className="group hover:bg-promptstack-primary/10 hover:border-promptstack-primary/30 transition-all duration-300 px-8 py-6 text-lg font-semibold linear-backdrop linear-border-glow">
              <Play className="mr-3 w-5 h-5" />
              Demo
            </Button>
          </div>

          {/* Linear-style floating elements */}
          <div className="relative mt-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl h-32 linear-bg rounded-2xl border border-promptstack-primary/10 linear-backdrop"></div>
            </div>
            
            {/* Linear-style application screenshot */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative">
                {/* Window frame */}
                <div className="bg-card/90 linear-backdrop rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                  {/* Window controls */}
                  <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>PromptStack</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="flex h-96">
                    {/* Sidebar */}
                    <div className="w-64 bg-card/50 border-r border-border/50 p-4">
                      <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold">PromptStack</span>
                      </div>
                      
                      <nav className="space-y-2">
                        <div className="flex items-center space-x-3 px-3 py-2 bg-accent rounded-md">
                          <Code className="w-4 h-4" />
                          <span className="text-sm font-medium">Prompts</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2 text-muted-foreground">
                          <GitBranch className="w-4 h-4" />
                          <span className="text-sm">Version Control</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2 text-muted-foreground">
                          <BarChart3 className="w-4 h-4" />
                          <span className="text-sm">A/B Testing</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Team</span>
                        </div>
                        <div className="flex items-center space-x-3 px-3 py-2 text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Analytics</span>
                        </div>
                      </nav>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">Prompt Editor</h3>
                          <p className="text-sm text-muted-foreground">GPT-4 • Temperature: 0.7</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-green-600">
                            <Play className="w-4 h-4 mr-1" />
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            <GitBranch className="w-4 h-4 mr-1" />
                            v1.2
                          </Button>
                        </div>
                      </div>

                      {/* Interactive code editor */}
                      <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-muted-foreground">customer-support-prompt.md</span>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>GPT-4</span>
                            <span>•</span>
                            <span>247 tokens</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-blue-500">You are a helpful customer support assistant for TechCorp...</div>
                          <div className="text-green-600 pl-4">Your role is to help customers with technical issues.</div>
                          <div className="text-green-600 pl-4">Customer query: {`{customer_query}`}</div>
                          <div className="text-green-600 pl-4">Please provide a helpful, professional response.</div>
                          <div className="text-blue-500">---</div>
                          <div className="text-gray-500">// Testing with sample query...</div>
                          <div className="text-green-600">✓ Response generated in 1.8s</div>
                          <div className="text-purple-600">Cost: $0.004 | Rating: 4.9/5 ⭐⭐⭐⭐⭐</div>
                        </div>
                      </div>

                      {/* Static results panel */}
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="bg-card/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-500">99.2%</div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                        <div className="bg-card/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-500">1.8s</div>
                          <div className="text-xs text-muted-foreground">Avg Latency</div>
                        </div>
                        <div className="bg-card/50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-500">$0.004</div>
                          <div className="text-xs text-muted-foreground">Cost/Test</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-8 text-lg">Trusted by teams at</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              <span className="font-semibold">TechCorp</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded"></div>
              <span className="font-semibold">AI Labs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span className="font-semibold">DataFlow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
              <span className="font-semibold">NeuralNet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-6">
            <Lightbulb className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            Everything you need to build with LLMs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From prompt versioning to A/B testing, PromptStack provides the tools teams need to build reliable AI applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: GitBranch,
              title: "Prompt Versioning",
              description: "Track changes, branch prompts, and merge improvements just like Git. Full history and diff views.",
              gradient: "from-blue-500 to-purple-500"
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Work together on prompts with real-time editing, comments, and approval workflows.",
              gradient: "from-green-500 to-blue-500"
            },
            {
              icon: BarChart3,
              title: "A/B Testing",
              description: "Test multiple prompt versions side-by-side with automated evaluation and metrics.",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "CI/CD for Prompts",
              description: "Deploy prompt changes safely with automated testing and rollback capabilities.",
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              icon: TrendingUp,
              title: "Analytics Dashboard",
              description: "Monitor token usage, costs, latency, and success rates across all your prompts.",
              gradient: "from-indigo-500 to-purple-500"
            },
            {
              icon: Shield,
              title: "Safety & Compliance",
              description: "Built-in content filtering, audit logs, and compliance tools for enterprise use.",
              gradient: "from-red-500 to-pink-500"
            }
          ].map((feature, index) => (
            <Card key={feature.title} className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            See PromptStack in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of collaborative prompt engineering with our interactive demo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Collaboration</h3>
                  <p className="text-muted-foreground">Multiple team members can edit prompts simultaneously with live cursors and comments</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Live Testing & Debugging</h3>
                  <p className="text-muted-foreground">Test prompts instantly with multiple AI models and real-time performance metrics</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">A/B Testing Suite</h3>
                  <p className="text-muted-foreground">Compare prompt versions with statistical analysis and automated winner selection</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dataset Management</h3>
                  <p className="text-muted-foreground">Upload and manage test datasets for comprehensive prompt validation</p>
                </div>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="bg-gradient-to-r from-card to-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
              <h4 className="font-semibold mb-4 text-center">Live Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">99.2%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">1.8s</div>
                  <div className="text-sm text-muted-foreground">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">$0.004</div>
                  <div className="text-sm text-muted-foreground">Cost/Test</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">2.4K</div>
                  <div className="text-sm text-muted-foreground">Tests Today</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Interactive Code Editor */}
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground ml-2">prompt-editor.tsx</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-500">Live</span>
                </div>
              </div>
              
              <div className="space-y-2 font-mono text-sm">
                <div className="text-blue-500">const prompt = `</div>
                <div className="pl-4 text-green-600">You are a helpful AI assistant...</div>
                <div className="pl-4 text-green-600">Please analyze the following data:</div>
                <div className="pl-4 text-green-600">{'{user_input}'}</div>
                <div className="text-blue-500">`;</div>
                <div className="text-gray-500">// Testing with GPT-4...</div>
                <div className="text-green-600">✓ Response generated in 1.2s</div>
                <div className="text-blue-600">Cost: $0.002 | Tokens: 156</div>
                <div className="text-purple-600">Rating: 4.8/5 ⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            {/* A/B Test Results */}
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">A/B Test Results</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-500">Winner: Version B</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600">Version A</div>
                  <div className="h-3 bg-blue-200 rounded w-full"></div>
                  <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                  <div className="h-3 bg-blue-200 rounded w-5/6"></div>
                  <div className="text-xs text-muted-foreground">Score: 78%</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-600">Version B</div>
                  <div className="h-3 bg-green-200 rounded w-full"></div>
                  <div className="h-3 bg-green-200 rounded w-full"></div>
                  <div className="h-3 bg-green-200 rounded w-4/5"></div>
                  <div className="text-xs text-muted-foreground">Score: 92%</div>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Team Activity</h4>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-background"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-background"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-background"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Sarah is editing prompt...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Mike added a comment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Alex approved changes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <GitPullRequest className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Version Control</h4>
            <p className="text-sm text-muted-foreground">Git-like branching, merging, and diff views for prompt management</p>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
            <p className="text-sm text-muted-foreground">Real-time metrics, cost tracking, and performance insights</p>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">CI/CD Pipeline</h4>
            <p className="text-sm text-muted-foreground">Automated testing and deployment workflows for prompts</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Button size="lg" className="group bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={handleGetStarted}>
            <Play className="mr-2 w-5 h-5" />
            Try It Now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Customer Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            What Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers and teams already using PromptStack
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Sarah Chen</h4>
                  <p className="text-sm text-muted-foreground">AI Engineer, TechCorp</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "PromptStack has revolutionized how our team manages AI prompts. The version control and A/B testing features are game-changers."
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Mike Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Lead Developer, AI Labs</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "The collaborative features are incredible. Our team can now work together on prompts in real-time, just like Google Docs."
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Alex Thompson</h4>
                  <p className="text-sm text-muted-foreground">CTO, DataFlow</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "The analytics dashboard helps us optimize costs and performance. We've reduced our AI costs by 40% since switching."
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Simple Pricing</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="relative group hover:scale-105 transition-transform duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
              <CardDescription>Perfect for individuals and small projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Up to 10 prompts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  1,000 API calls/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Community support
                </li>
              </ul>
              <Button className="w-full mt-6 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90" onClick={handleGetStarted}>
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative group hover:scale-105 transition-transform duration-300 border-2 border-promptstack-primary bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-promptstack-primary to-promptstack-secondary text-white px-4 py-1 rounded-full text-xs font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold">$29<span className="text-lg text-muted-foreground">/month</span></div>
              <CardDescription>For growing teams and businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Unlimited prompts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  100,000 API calls/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  A/B testing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Priority support
                </li>
              </ul>
              <Button className="w-full mt-6 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90" onClick={handleGetStarted}>
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative group hover:scale-105 transition-transform duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold">Custom</div>
              <CardDescription>For large organizations with specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  SSO & advanced security
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Custom SLA
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-6" onClick={() => alert('Contact sales team!')}>
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-6">
            <MessageSquare className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Common Questions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about PromptStack
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              question: "How is PromptStack different from regular code repositories?",
              answer: "PromptStack is specifically designed for prompt engineering workflows. It includes built-in A/B testing, real-time collaboration, cost tracking, and integration with multiple AI models - features that generic code repositories don't provide."
            },
            {
              question: "Which AI models does PromptStack support?",
              answer: "We support all major AI models including GPT-4, GPT-3.5-turbo, Claude-3, Claude-2, and more. You can easily switch between models and compare their performance side-by-side."
            },
            {
              question: "Can I use PromptStack with my existing AI infrastructure?",
              answer: "Yes! PromptStack integrates seamlessly with your existing AI infrastructure. You can connect your own API keys and continue using your preferred AI models while gaining our collaboration and testing features."
            },
            {
              question: "How does the A/B testing work?",
              answer: "Our A/B testing feature allows you to test multiple prompt versions against the same dataset. We automatically evaluate responses for accuracy, relevance, and cost-effectiveness, then recommend the best performing version."
            },
            {
              question: "Is my data secure?",
              answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and never store your actual AI responses. Your prompts and data remain private and secure."
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel your subscription at any time. Your data will be preserved for 30 days, and you can export all your prompts and test results before cancellation."
            }
          ].map((faq, index) => (
            <Card key={index} className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-promptstack-primary to-promptstack-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <CardContent className="p-6 relative">
                <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <Card className="max-w-5xl mx-auto bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border-promptstack-primary/20 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/20 to-promptstack-secondary/20 border border-promptstack-primary/30 rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-promptstack-primary" />
              <span className="text-sm font-medium text-promptstack-primary">Ready to Launch?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
              Ready to build the future of AI?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of developers and teams already using PromptStack to build better AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={handleGetStarted}>
                <Rocket className="mr-2 w-5 h-5" />
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => alert('Documentation would open here!')} className="group hover:bg-promptstack-primary/10 hover:border-promptstack-primary/30 transition-all duration-300">
                <Globe className="mr-2 w-4 h-4" />
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Newsletter Signup */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border border-promptstack-primary/20 rounded-full px-4 py-2 mb-6">
            <MessageSquare className="w-4 h-4 text-promptstack-primary" />
            <span className="text-sm font-medium text-promptstack-primary">Newsletter</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            Stay Updated
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the latest updates on prompt engineering, AI development, and new PromptStack features
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="card-hover group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-promptstack-primary to-promptstack-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-promptstack-primary to-promptstack-secondary hover:from-promptstack-primary/90 hover:to-promptstack-secondary/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">PromptStack</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ClientOnly>
  )
} 