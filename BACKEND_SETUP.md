# PromptStack Backend Setup Guide

## 🚀 Backend Architecture

PromptStack uses a modern, scalable backend architecture:

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **API**: Next.js API Routes with TypeScript
- **LLM Integration**: OpenAI and Anthropic APIs
- **Validation**: Zod schema validation
- **Security**: bcrypt password hashing

## 📋 Prerequisites

1. **Node.js 18+** and npm
2. **PostgreSQL** database
3. **API Keys** for OpenAI and/or Anthropic

## 🗄️ Database Setup

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE promptstack;

# Create user (optional)
CREATE USER promptstack_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE promptstack TO promptstack_user;

# Exit
\q
```

### 3. Configure Environment

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Edit `.env.local` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/promptstack"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

### 4. Seed Database (Optional)

```bash
npx prisma db seed
```

## 🏃‍♂️ Running the Backend

### Development Mode

```bash
npm run dev
```

The backend will be available at:
- **API**: http://localhost:3000/api
- **Frontend**: http://localhost:3000

### Production Mode

```bash
npm run build
npm start
```

## 📊 Database Schema

### Core Models

#### Users
- Authentication and profile management
- Workspace memberships
- Role-based access control

#### Workspaces
- Multi-tenant organization
- Settings and limits
- Member management

#### Projects
- Group prompts and datasets
- Workspace organization
- Access control

#### Prompts
- Version control with history
- Model configuration
- Variable templating

#### Test Runs
- Execution results
- Performance metrics
- Cost tracking

#### A/B Tests
- Comparative testing
- Statistical analysis
- Winner selection

## 🔐 Authentication

### Features
- **JWT-based sessions**
- **Password hashing** with bcrypt
- **Role-based access** (Admin, Member, Viewer)
- **Workspace permissions**

### API Endpoints

```typescript
// Authentication
POST /api/auth/signup     // User registration
POST /api/auth/signin     // User login
GET  /api/auth/signout    // User logout

// Session management
GET  /api/auth/session    // Get current session
```

## 📝 API Endpoints

### Prompts

```typescript
// CRUD operations
GET    /api/prompts              // List prompts
POST   /api/prompts              // Create prompt
GET    /api/prompts/[id]         // Get prompt
PUT    /api/prompts/[id]         // Update prompt
DELETE /api/prompts/[id]         // Delete prompt

// Testing
POST   /api/prompts/[id]/test    // Run prompt test
GET    /api/prompts/[id]/test    // Get test runs
```

### Analytics

```typescript
GET /api/analytics               // Dashboard metrics
GET /api/analytics/costs         // Cost analysis
GET /api/analytics/performance   // Performance metrics
```

### Workspaces

```typescript
GET    /api/workspaces           // List workspaces
POST   /api/workspaces           // Create workspace
GET    /api/workspaces/[id]      // Get workspace
PUT    /api/workspaces/[id]      // Update workspace
```

## 🤖 LLM Integration

### Supported Models

#### OpenAI
- `gpt-4`
- `gpt-3.5-turbo`
- `gpt-4-turbo`

#### Anthropic
- `claude-3-opus`
- `claude-3-sonnet`
- `claude-3-haiku`

### Features
- **Variable substitution** in prompts
- **Cost tracking** per model
- **Performance monitoring**
- **Error handling**

## 📈 Analytics & Monitoring

### Metrics Tracked
- **Token usage** per model
- **Cost analysis** by workspace
- **Performance** (latency, success rate)
- **Usage patterns** over time

### Dashboard Data
- Total prompts and test runs
- Cost trends and projections
- Model performance comparison
- Success rate analysis

## 🔒 Security Features

### Authentication
- **Secure password hashing** with bcrypt
- **JWT token management**
- **Session validation**

### Authorization
- **Workspace-level permissions**
- **Role-based access control**
- **API endpoint protection**

### Data Protection
- **Input validation** with Zod
- **SQL injection prevention** via Prisma
- **Rate limiting** (configurable)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables**:
   ```env
   DATABASE_URL="your-production-db-url"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-production-secret"
   OPENAI_API_KEY="your-openai-key"
   ANTHROPIC_API_KEY="your-anthropic-key"
   ```
3. **Deploy automatically** on push to main

### Self-Hosted

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set up production database**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing

```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test prompt creation
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Prompt","content":"Hello {{name}}","projectId":"project_id"}'
```

### Database Testing

```bash
# Open Prisma Studio
npx prisma studio

# Run database tests
npm run test:db
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | JWT secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | No* |
| `ANTHROPIC_API_KEY` | Anthropic API key | No* |

*At least one LLM API key is required

### Database Configuration

```env
# Development
DATABASE_URL="postgresql://username:password@localhost:5432/promptstack"

# Production (with connection pooling)
DATABASE_URL="postgresql://username:password@host:5432/promptstack?pgbouncer=true&connection_limit=1&pool_timeout=20"
```

## 📚 API Documentation

### Request/Response Examples

#### Create Prompt
```typescript
POST /api/prompts
{
  "name": "Email Summarizer",
  "content": "Summarize this email: {{email_content}}",
  "description": "Summarize long emails",
  "projectId": "project_id",
  "model": "gpt-4",
  "temperature": 0.7
}
```

#### Run Test
```typescript
POST /api/prompts/[id]/test
{
  "input": {
    "email_content": "Long email content here..."
  },
  "rating": 4,
  "feedback": "Good summary"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database status
   npx prisma db push
   
   # Reset database
   npx prisma migrate reset
   ```

2. **Authentication Issues**
   ```bash
   # Clear sessions
   npm run clear-sessions
   
   # Check environment variables
   echo $NEXTAUTH_SECRET
   ```

3. **LLM API Errors**
   ```bash
   # Test API keys
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
   ```

### Logs

```bash
# Development logs
npm run dev

# Production logs
npm start 2>&1 | tee app.log
```

## 📞 Support

- **Documentation**: [docs.promptstack.com](https://docs.promptstack.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/promptstack/issues)
- **Discord**: [Join our community](https://discord.gg/promptstack)

---

The backend is now ready to power your PromptStack application! 🚀 