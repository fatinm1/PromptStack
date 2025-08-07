'use client'

import React from 'react'
import { Logo } from '@/components/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoDemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Promptrix Logo Showcase</h1>
        </div>

        {/* Logo Variations */}
        <div className="grid gap-8">
          {/* Full Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Full Logo (Default)</CardTitle>
              <CardDescription>Complete logo with text and icon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
                <Logo size="lg" showText={true} />
              </div>
            </CardContent>
          </Card>

          {/* Icon Only */}
          <Card>
            <CardHeader>
              <CardTitle>Icon Only</CardTitle>
              <CardDescription>Just the logo icon without text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
                <Logo size="lg" showText={false} />
              </div>
            </CardContent>
          </Card>

          {/* Different Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Different Sizes</CardTitle>
              <CardDescription>Logo in various sizes for different use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8 p-8 bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Logo size="sm" showText={true} />
                  <p className="text-xs text-muted-foreground mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Logo size="md" showText={true} />
                  <p className="text-xs text-muted-foreground mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Logo size="lg" showText={true} />
                  <p className="text-xs text-muted-foreground mt-2">Large</p>
                </div>
                <div className="text-center">
                  <Logo size="xl" showText={true} />
                  <p className="text-xs text-muted-foreground mt-2">Extra Large</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Concept Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Design Concept</CardTitle>
              <CardDescription>What each element represents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Visual Elements:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Neural Network:</strong> Represents AI/LLM capabilities</li>
                    <li>• <strong>Code Brackets:</strong> Symbolizes prompts and code</li>
                    <li>• <strong>Git Branches:</strong> Version control and collaboration</li>
                    <li>• <strong>Gradient Background:</strong> Modern tech aesthetic</li>
                    <li>• <strong>Sparkles:</strong> Innovation and creativity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Brand Message:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>GitHub for Prompts:</strong> Version control for AI</li>
                    <li>• <strong>Collaboration:</strong> Team-based prompt development</li>
                    <li>• <strong>Innovation:</strong> Cutting-edge AI technology</li>
                    <li>• <strong>Professional:</strong> Enterprise-grade platform</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Primary and secondary brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-promptrix-primary to-promptrix-secondary rounded-lg mx-auto mb-2"></div>
                  <p className="text-xs font-medium">Primary Gradient</p>
                  <p className="text-xs text-muted-foreground">#667eea → #764ba2</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-promptrix-primary rounded-lg mx-auto mb-2"></div>
                  <p className="text-xs font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">#667eea</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-promptstack-secondary rounded-lg mx-auto mb-2"></div>
                  <p className="text-xs font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">#764ba2</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2 border"></div>
                  <p className="text-xs font-medium">Background</p>
                  <p className="text-xs text-muted-foreground">System colors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 