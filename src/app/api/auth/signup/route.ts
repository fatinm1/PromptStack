import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Simple demo registration - in a real app, you'd save to database
    if (name && email && password) {
      const user = {
        id: `demo-user-${Date.now()}`,
        name: name,
        email: email,
        avatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}`
      }

      return NextResponse.json({ 
        success: true, 
        user,
        message: 'Account created successfully' 
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Name, email and password are required' },
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