import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = authHeader.replace('Bearer ', '')
    
    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get user's workspaces
    const userWorkspaces = await prisma.workspaceMember.findMany({
      where: { userId: user.id },
      select: { workspaceId: true }
    })

    const workspaceIds = userWorkspaces.map(w => w.workspaceId)

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    // Build workspace filter
    const workspaceFilter = workspaceId 
      ? { workspaceId } 
      : { workspaceId: { in: workspaceIds } }

    // Get analytics data
    const [
      totalPrompts,
      totalTestRuns,
      totalCost,
      totalTokens,
      averageLatency,
      successRate,
      topModels,
      costByDate,
      tokenUsageByDate
    ] = await Promise.all([
      // Total prompts
      prisma.prompt.count({
        where: {
          project: workspaceFilter
        }
      }),

      // Total test runs
      prisma.testRun.count({
        where: {
          prompt: {
            project: workspaceFilter
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      }),

      // Total cost
      prisma.testRun.aggregate({
        where: {
          prompt: {
            project: workspaceFilter
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _sum: {
          cost: true
        }
      }),

      // Total tokens
      prisma.testRun.aggregate({
        where: {
          prompt: {
            project: workspaceFilter
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _sum: {
          tokensUsed: true
        }
      }),

      // Average latency
      prisma.testRun.aggregate({
        where: {
          prompt: {
            project: workspaceFilter
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _avg: {
          latency: true
        }
      }),

      // Success rate (test runs with rating >= 4)
      prisma.testRun.count({
        where: {
          prompt: {
            project: workspaceFilter
          },
          rating: {
            gte: 4
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        }
      }),

      // Top models by usage
      prisma.testRun.groupBy({
        by: ['model'],
        where: {
          prompt: {
            project: workspaceFilter
          },
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
        },
        _count: {
          model: true
        },
        orderBy: {
          _count: {
            model: 'desc'
          }
        },
        take: 5
      }),

      // Cost by date (last 30 days)
      prisma.testRun.groupBy({
        by: ['createdAt'],
        where: {
          prompt: {
            project: workspaceFilter
          },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          cost: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // Token usage by date (last 30 days)
      prisma.testRun.groupBy({
        by: ['createdAt'],
        where: {
          prompt: {
            project: workspaceFilter
          },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          tokensUsed: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ])

    // Calculate success rate percentage
    const totalRatedTests = await prisma.testRun.count({
      where: {
        prompt: {
          project: workspaceFilter
        },
        rating: {
          not: null
        },
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      }
    })

    const successRatePercentage = totalRatedTests > 0 
      ? (successRate / totalRatedTests) * 100 
      : 0

    return NextResponse.json({
      totalPrompts,
      totalTestRuns,
      totalCost: totalCost._sum.cost || 0,
      totalTokens: totalTokens._sum.tokensUsed || 0,
      averageLatency: averageLatency._avg.latency || 0,
      successRate: successRatePercentage,
      topModels: topModels.map(model => ({
        model: model.model,
        usage: model._count.model
      })),
      costByDate: costByDate.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        cost: item._sum.cost || 0
      })),
      tokenUsageByDate: tokenUsageByDate.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        tokens: item._sum.tokensUsed || 0
      }))
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 