import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample user if it doesn't exist
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: test123
    },
  })

  console.log('✅ User created:', user.email)

  // Create a workspace for the user
  const workspace = await prisma.workspace.upsert({
    where: { id: 'sample-workspace' },
    update: {},
    create: {
      id: 'sample-workspace',
      name: 'Sample Workspace',
      description: 'A sample workspace for testing',
      createdBy: user.id,
      defaultModel: 'gpt-3.5-turbo',
      defaultTemperature: 0.7,
      maxTokens: 1000,
      allowedModels: 'gpt-3.5-turbo,gpt-4',
      costLimit: 100,
      tokenLimit: 100000,
    },
  })

  console.log('✅ Workspace created:', workspace.name)

  // Add user to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  })

  console.log('✅ User added to workspace')

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project' },
    update: {},
    create: {
      id: 'sample-project',
      name: 'Sample Project',
      description: 'A sample project for testing prompts',
      workspaceId: workspace.id,
      createdBy: user.id,
    },
  })

  console.log('✅ Project created:', project.name)

  // Create a sample prompt
  const prompt = await prisma.prompt.upsert({
    where: { id: 'sample-prompt' },
    update: {},
    create: {
      id: 'sample-prompt',
      name: 'Sample Prompt',
      content: 'You are a helpful assistant. Please help the user with their question.',
      projectId: project.id,
      createdBy: user.id,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    },
  })

  console.log('✅ Prompt created:', prompt.name)

  // Create a sample test run
  const testRun = await prisma.testRun.upsert({
    where: { id: 'sample-test-run' },
    update: {},
    create: {
      id: 'sample-test-run',
      promptId: prompt.id,
      promptVersion: 1,
      input: 'Hello, how are you?',
      output: 'Hello! I\'m doing well, thank you for asking. How can I help you today?',
      model: 'gpt-3.5-turbo',
      tokensUsed: 25,
      cost: 0.0005,
      latency: 1200,
      rating: 5,
      feedback: 'Sample test run for demonstration',
      createdBy: user.id,
    },
  })

  console.log('✅ Test run created')

  // Create a sample dataset
  const dataset = await prisma.dataset.upsert({
    where: { id: 'sample-dataset' },
    update: {},
    create: {
      id: 'sample-dataset',
      name: 'Sample Dataset',
      description: 'A sample dataset for testing',
      projectId: project.id,
      createdBy: user.id,
    },
  })

  console.log('✅ Dataset created:', dataset.name)

  // Create sample dataset items
  const datasetItems = await Promise.all([
    prisma.datasetItem.upsert({
      where: { id: 'sample-item-1' },
      update: {},
      create: {
        id: 'sample-item-1',
        datasetId: dataset.id,
        input: 'What is the weather like?',
        expectedOutput: 'I cannot provide real-time weather information.',
        tags: 'weather,easy',
      },
    }),
    prisma.datasetItem.upsert({
      where: { id: 'sample-item-2' },
      update: {},
      create: {
        id: 'sample-item-2',
        datasetId: dataset.id,
        input: 'How do I make coffee?',
        expectedOutput: 'Here are the steps to make coffee...',
        tags: 'cooking,medium',
      },
    }),
  ])

  console.log('✅ Dataset items created:', datasetItems.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 