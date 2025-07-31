import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple demo authentication - in a real app, you'd validate against database
    if (email && password) {
      // For demo purposes, accept any email/password combination
      const user = {
        id: 'demo-user-1',
        name: email.split('@')[0] || 'Demo User',
        email: email,
        avatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}`
      }

      return NextResponse.json({ 
        success: true, 
        user,
        message: 'Login successful' 
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 