'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { TypingAnimation } from '@/components/typing-animation'
import { AdvancedTypingAnimation } from '@/components/advanced-typing-animation'
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
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

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
    // For now, just show an alert
    alert('Demo video would play here!')
  }

  const handlePricing = () => {
    // Scroll to pricing section or show pricing modal
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Pricing information coming soon!')
    }
  }

  const handleDocs = () => {
    // Open documentation or show docs modal
    alert('Documentation will open in a new tab!')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PromptStack</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <button onClick={handlePricing} className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
            <button onClick={handleDocs} className="text-sm font-medium hover:text-primary transition-colors">Docs</button>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
            <Button size="sm" onClick={handleGetStarted}>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <TypingAnimation 
              text="GitHub for LLM Prompts" 
              speed={80}
              delay={500}
              className="gradient-text"
            />
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            <AdvancedTypingAnimation 
              lines={[
                "Collaborate, version control, and test your LLM prompts with the power of Git-like workflows.",
                "Build better AI applications together."
              ]}
              speed={50}
              delay={2000}
              className="text-xl text-muted-foreground"
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group" onClick={handleGetStarted}>
              Start Building
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleWatchDemo}>
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build with LLMs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From prompt versioning to A/B testing, PromptStack provides the tools teams need to build reliable AI applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardHeader>
              <GitBranch className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>Prompt Versioning</CardTitle>
              <CardDescription>
                Track changes, branch prompts, and merge improvements just like Git. Full history and diff views.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Users className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work together on prompts with real-time editing, comments, and approval workflows.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>A/B Testing</CardTitle>
              <CardDescription>
                Test multiple prompt versions side-by-side with automated evaluation and metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Zap className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>CI/CD for Prompts</CardTitle>
              <CardDescription>
                Deploy prompt changes safely with automated testing and rollback capabilities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Monitor token usage, costs, latency, and success rates across all your prompts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Shield className="w-8 h-8 text-promptstack-primary mb-2" />
              <CardTitle>Safety & Compliance</CardTitle>
              <CardDescription>
                Built-in content filtering, audit logs, and compliance tools for enterprise use.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
              <CardDescription>Perfect for individuals and small projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Up to 10 prompts
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  1,000 API calls/month
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Community support
                </li>
              </ul>
              <Button className="w-full mt-6" onClick={handleGetStarted}>
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-promptstack-primary">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-promptstack-primary text-white px-3 py-1 rounded-full text-xs font-medium">
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
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Unlimited prompts
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  100,000 API calls/month
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  A/B testing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Priority support
                </li>
              </ul>
              <Button className="w-full mt-6" onClick={handleGetStarted}>
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold">Custom</div>
              <CardDescription>For large organizations with specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  SSO & advanced security
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-promptstack-primary/10 to-promptstack-secondary/10 border-promptstack-primary/20">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build the future of AI?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and teams already using PromptStack to build better AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => alert('Documentation would open here!')}>
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
  )
} 