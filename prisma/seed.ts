import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample user if it doesn't exist
  const password = 'test123'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
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

  // Create additional sample prompts
  const prompt2 = await prisma.prompt.upsert({
    where: { id: 'sample-prompt-2' },
    update: {},
    create: {
      id: 'sample-prompt-2',
      name: 'Email Summarizer',
      description: 'Summarize long emails into concise bullet points',
      content: 'Summarize the following email in 3-5 bullet points: {{email_content}}',
      projectId: project.id,
      createdBy: user.id,
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
    },
  })

  const prompt3 = await prisma.prompt.upsert({
    where: { id: 'sample-prompt-3' },
    update: {},
    create: {
      id: 'sample-prompt-3',
      name: 'Content Generator',
      description: 'Generate blog post content based on keywords',
      content: 'Write a blog post about {{topic}} with the following keywords: {{keywords}}',
      projectId: project.id,
      createdBy: user.id,
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      maxTokens: 1500,
    },
  })

  console.log('✅ Additional prompts created:', 2)

  // Create sample A/B tests
  const abTest1 = await prisma.aBTest.upsert({
    where: { id: 'sample-ab-test-1' },
    update: {},
    create: {
      id: 'sample-ab-test-1',
      name: 'Email Subject Line Test',
      description: 'Testing different email subject line approaches',
      promptAId: prompt.id,
      promptBId: prompt2.id,
      promptAVersion: 1,
      promptBVersion: 1,
      testInputs: JSON.stringify([
        { product_name: 'Premium Widget' },
        { product_name: 'Smart Gadget' }
      ]),
      status: 'RUNNING',
      createdBy: user.id,
    },
  })

  const abTest2 = await prisma.aBTest.upsert({
    where: { id: 'sample-ab-test-2' },
    update: {},
    create: {
      id: 'sample-ab-test-2',
      name: 'Product Description Test',
      description: 'Comparing different product description styles',
      promptAId: prompt2.id,
      promptBId: prompt3.id,
      promptAVersion: 1,
      promptBVersion: 1,
      testInputs: JSON.stringify([
        { product_name: 'AI Assistant', key_feature: 'Natural Language Processing', use_case: 'Customer Support' },
        { product_name: 'Data Analyzer', key_feature: 'Real-time Analytics', use_case: 'Business Intelligence' }
      ]),
      status: 'COMPLETED',
      createdBy: user.id,
    },
  })

  console.log('✅ A/B tests created:', 2)

  // Create additional test runs
  const testRun2 = await prisma.testRun.upsert({
    where: { id: 'sample-test-run-2' },
    update: {},
    create: {
      id: 'sample-test-run-2',
      promptId: prompt2.id,
      promptVersion: 1,
      input: 'Please summarize this long email about quarterly results...',
      output: '• Q4 revenue increased 15% year-over-year\n• New product launch successful\n• Customer satisfaction at 94%\n• Next quarter focus on expansion',
      model: 'gpt-4',
      tokensUsed: 45,
      cost: 0.0012,
      latency: 1800,
      rating: 4,
      feedback: 'Good summary, captures key points well',
      createdBy: user.id,
    },
  })

  const testRun3 = await prisma.testRun.upsert({
    where: { id: 'sample-test-run-3' },
    update: {},
    create: {
      id: 'sample-test-run-3',
      promptId: prompt3.id,
      promptVersion: 1,
      input: 'Topic: AI in Healthcare, Keywords: machine learning, diagnostics, patient care',
      output: 'AI is revolutionizing healthcare through machine learning-powered diagnostics...',
      model: 'gpt-3.5-turbo',
      tokensUsed: 120,
      cost: 0.0008,
      latency: 950,
      rating: 5,
      feedback: 'Excellent content generation, very informative',
      createdBy: user.id,
    },
  })

  console.log('✅ Additional test runs created:', 2)

  // Create sample users for team members first
  const sampleUser1 = await prisma.user.upsert({
    where: { id: 'sample-user-1' },
    update: {},
    create: {
      id: 'sample-user-1',
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      password: await bcrypt.hash('password123', 10),
      avatar: 'https://avatars.githubusercontent.com/u/1',
    },
  })

  const sampleUser2 = await prisma.user.upsert({
    where: { id: 'sample-user-2' },
    update: {},
    create: {
      id: 'sample-user-2',
      email: 'mike@example.com',
      name: 'Mike Rodriguez',
      password: await bcrypt.hash('password123', 10),
      avatar: 'https://avatars.githubusercontent.com/u/2',
    },
  })

  console.log('✅ Sample users created:', 2)

  // Create sample team members
  const teamMember1 = await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: sampleUser1.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: sampleUser1.id,
      role: 'MEMBER',
    },
  })

  const teamMember2 = await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: sampleUser2.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: sampleUser2.id,
      role: 'VIEWER',
    },
  })

  console.log('✅ Team members created:', 2)

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