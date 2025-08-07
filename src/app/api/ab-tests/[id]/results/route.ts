import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the A/B test with results
    const abTest = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            promptA: {
              project: {
                workspace: {
                  members: { some: { userId: user.id } }
                }
              }
            }
          },
          {
            promptB: {
              project: {
                workspace: {
                  members: { some: { userId: user.id } }
                }
              }
            }
          }
        ]
      },
      include: {
        promptA: {
          select: {
            name: true,
            content: true,
            version: true,
            model: true
          }
        },
        promptB: {
          select: {
            name: true,
            content: true,
            version: true,
            model: true
          }
        },
        results: {
          orderBy: { createdAt: 'desc' }
        },
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    if (!abTest) {
      return NextResponse.json({ error: 'A/B test not found' }, { status: 404 })
    }

    // Calculate statistics
    const totalResults = abTest.results.length
    const aWins = abTest.results.filter(r => r.winner === 'A').length
    const bWins = abTest.results.filter(r => r.winner === 'B').length
    const ties = abTest.results.filter(r => r.winner === 'TIE').length

    // Calculate average ratings
    const aRatings = abTest.results.filter(r => r.ratingA !== null).map(r => r.ratingA!)
    const bRatings = abTest.results.filter(r => r.ratingB !== null).map(r => r.ratingB!)
    
    const avgRatingA = aRatings.length > 0 ? aRatings.reduce((a, b) => a + b, 0) / aRatings.length : 0
    const avgRatingB = bRatings.length > 0 ? bRatings.reduce((a, b) => a + b, 0) / bRatings.length : 0

    // Determine overall winner
    let overallWinner = null
    if (aWins > bWins) {
      overallWinner = 'A'
    } else if (bWins > aWins) {
      overallWinner = 'B'
    } else {
      overallWinner = 'TIE'
    }

    // Calculate confidence level (simple statistical significance)
    const totalTests = aWins + bWins + ties
    const confidenceLevel = totalTests > 0 ? 
      Math.min((Math.max(aWins, bWins) / totalTests) * 100, 100) : 0

    return NextResponse.json({
      test: {
        id: abTest.id,
        name: abTest.name,
        description: abTest.description,
        status: abTest.status,
        createdAt: abTest.createdAt,
        updatedAt: abTest.updatedAt,
        creator: abTest.creator
      },
      prompts: {
        a: abTest.promptA,
        b: abTest.promptB
      },
      results: abTest.results,
      statistics: {
        totalTests,
        aWins,
        bWins,
        ties,
        aWinRate: totalTests > 0 ? (aWins / totalTests) * 100 : 0,
        bWinRate: totalTests > 0 ? (bWins / totalTests) * 100 : 0,
        tieRate: totalTests > 0 ? (ties / totalTests) * 100 : 0,
        avgRatingA,
        avgRatingB,
        overallWinner,
        confidenceLevel
      }
    })

  } catch (error) {
    console.error('Get A/B test results error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 