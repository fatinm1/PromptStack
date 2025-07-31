'use client'

import React, { useState, useEffect } from 'react'

interface AdvancedTypingAnimationProps {
  lines: string[]
  speed?: number
  delay?: number
  className?: string
  repeat?: boolean
  repeatDelay?: number
}

export function AdvancedTypingAnimation({ 
  lines, 
  speed = 80, 
  delay = 1000, 
  className = "",
  repeat = false,
  repeatDelay = 3000
}: AdvancedTypingAnimationProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Start typing after initial delay
    const startTimer = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    if (currentLine < lines.length) {
      const currentLineText = lines[currentLine]
      
      if (currentIndex < currentLineText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentLineText.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }, speed)

        return () => clearTimeout(timer)
      } else {
        // Move to next line
        const nextLineTimer = setTimeout(() => {
          if (currentLine + 1 < lines.length) {
            setCurrentLine(currentLine + 1)
            setCurrentIndex(0)
            setDisplayText('')
          } else if (repeat) {
            // Reset to first line if repeat is enabled
            const repeatTimer = setTimeout(() => {
              setCurrentLine(0)
              setCurrentIndex(0)
              setDisplayText('')
            }, repeatDelay)
            return () => clearTimeout(repeatTimer)
          }
        }, 500) // Pause between lines

        return () => clearTimeout(nextLineTimer)
      }
    }
  }, [currentIndex, currentLine, lines, speed, isTyping, repeat, repeatDelay])

  return (
    <div className={className}>
      {displayText}
      <span className="typing-cursor">|</span>
    </div>
  )
} 