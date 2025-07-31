import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/db'

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        workspaceMemberships: {
          include: {
            workspace: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || '')

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      message: 'Login successful' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signin error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 