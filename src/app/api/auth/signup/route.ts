import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/db'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}`
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    })

    // Create default workspace for the user
    const workspace = await prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        description: 'Default workspace',
        createdBy: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      user,
      workspace,
      message: 'Account created successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 