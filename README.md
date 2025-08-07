# Promptrix - GitHub for LLM Prompts & Workflows

A comprehensive platform for managing, versioning, testing, and deploying LLM prompts with team collaboration features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fatinm1/Promptrix.git
   cd Promptrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Test Account

For development and testing, you can use the following test account:

- **Email:** `test@example.com`
- **Password:** `test123`

This account comes with sample data including:
- 1 workspace
- 1 project with sample prompts
- 1 dataset with test items
- Sample test runs and analytics data

## 🎯 Features

### Core Functionality
- **Prompt Versioning**: Git-like version control for prompts
- **A/B Testing**: Compare prompt versions with statistical analysis
- **Real-time Collaboration**: Team editing with live cursors
- **Cost Tracking**: Monitor token usage and costs
- **Analytics Dashboard**: Performance metrics and insights

### Team Features
- **Workspace Management**: Organize projects by workspace
- **Role-based Access**: Owner, Admin, and Member roles
- **Activity Tracking**: Monitor team activity and changes
- **Approval Workflows**: Review and approve prompt changes

### AI Integration
- **Multi-Model Support**: GPT-4, GPT-3.5, Claude, and more
- **Real-time Testing**: Test prompts instantly
- **Batch Processing**: Run tests on datasets
- **Performance Monitoring**: Track latency and success rates

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI APIs**: OpenAI, Anthropic
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions
├── store/                # Zustand stores
└── types/                # TypeScript types
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Commands
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Push schema changes
- `npx prisma db seed` - Seed with sample data
- `npx prisma generate` - Generate Prisma client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Promptrix** - Building the future of AI prompt engineering, one version at a time. 🚀 