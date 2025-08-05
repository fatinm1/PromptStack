import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

export function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* SVG Logo */}
      <svg 
        className={sizeClasses[size]} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#f0f0f0', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        {/* Main background circle */}
        <circle cx="24" cy="24" r="22" fill="url(#bgGradient)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
        
        {/* AI Brain/Neural Network representation */}
        <g stroke="url(#textGradient)" strokeWidth="1.5" fill="none" opacity="0.9">
          {/* Central nodes */}
          <circle cx="24" cy="16" r="2" fill="url(#textGradient)"/>
          <circle cx="20" cy="20" r="2" fill="url(#textGradient)"/>
          <circle cx="28" cy="20" r="2" fill="url(#textGradient)"/>
          <circle cx="24" cy="24" r="2" fill="url(#textGradient)"/>
          <circle cx="20" cy="28" r="2" fill="url(#textGradient)"/>
          <circle cx="28" cy="28" r="2" fill="url(#textGradient)"/>
          <circle cx="24" cy="32" r="2" fill="url(#textGradient)"/>
          
          {/* Connection lines */}
          <line x1="24" y1="16" x2="20" y2="20"/>
          <line x1="24" y1="16" x2="28" y2="20"/>
          <line x1="20" y1="20" x2="24" y2="24"/>
          <line x1="28" y1="20" x2="24" y2="24"/>
          <line x1="24" y1="24" x2="20" y2="28"/>
          <line x1="24" y1="24" x2="28" y2="28"/>
          <line x1="20" y1="28" x2="24" y2="32"/>
          <line x1="28" y1="28" x2="24" y2="32"/>
          
          {/* Cross connections */}
          <line x1="20" y1="20" x2="28" y2="28"/>
          <line x1="28" y1="20" x2="20" y2="28"/>
        </g>
        
        {/* Code brackets representing prompts */}
        <g stroke="url(#textGradient)" strokeWidth="2" fill="none" opacity="0.8">
          {/* Left bracket */}
          <path d="M 12 18 L 16 18 L 16 30 L 12 30" strokeLinecap="round"/>
          {/* Right bracket */}
          <path d="M 36 18 L 32 18 L 32 30 L 36 30" strokeLinecap="round"/>
        </g>
        
        {/* Version control branches */}
        <g stroke="url(#textGradient)" strokeWidth="1.5" fill="none" opacity="0.7">
          {/* Main branch */}
          <line x1="16" y1="36" x2="32" y2="36"/>
          {/* Feature branch */}
          <path d="M 20 36 L 20 40 L 28 40 L 28 36" strokeLinecap="round"/>
          {/* Branch dots */}
          <circle cx="20" cy="36" r="1.5" fill="url(#textGradient)"/>
          <circle cx="28" cy="36" r="1.5" fill="url(#textGradient)"/>
          <circle cx="20" cy="40" r="1.5" fill="url(#textGradient)"/>
          <circle cx="28" cy="40" r="1.5" fill="url(#textGradient)"/>
        </g>
        
        {/* Sparkle effects */}
        <g fill="url(#textGradient)" opacity="0.6">
          <circle cx="14" cy="14" r="0.8"/>
          <circle cx="34" cy="14" r="0.8"/>
          <circle cx="14" cy="34" r="0.8"/>
          <circle cx="34" cy="34" r="0.8"/>
        </g>
      </svg>
      
      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl bg-gradient-to-r from-promptstack-primary to-promptstack-secondary bg-clip-text text-transparent">
            PromptStack
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            AI Prompt Platform
          </span>
        </div>
      )}
    </div>
  )
} 