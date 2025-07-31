# PromptStack 🚀

**GitHub for LLM Prompts & Workflows**

PromptStack is a collaboration and version control platform for prompt engineering. Teams working with large language models (LLMs) often test and tweak many prompt variations. PromptStack helps you manage, test, and deploy prompts the same way Git helps manage code.

## ✨ Features

- **Prompt Versioning**: Track history and changes of prompts across projects
- **Prompt Branching & Collaboration**: Fork prompts, collaborate with team members, and merge improvements
- **Prompt Testing & Evaluation**: A/B test multiple prompts on sample inputs and rate outputs
- **Dataset Management**: Upload and label test datasets for prompt validation
- **Metrics Dashboard**: Token usage, response latency, cost per prompt, hallucination rate
- **CI/CD for Prompts**: Deploy prompt changes safely to production via auto pipelines
- **Prompt Templates**: Reusable components with variables (like `{{user_input}}` or `{{tone}}`)
- **Integration**: Works with LangChain, LlamaIndex, OpenAI SDKs, and more

## 🎨 Design Philosophy

- **Modern & Minimal**: Clean, developer-focused interface inspired by Linear, Vercel, and Raycast
- **Dark/Light Theme**: Full theme support with smooth transitions
- **Responsive**: Works seamlessly across desktop, tablet, and mobile
- **Accessible**: Built with accessibility in mind using Radix UI primitives

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts
- **Code Editor**: Monaco Editor
- **Animations**: Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/promptstack.git
   cd promptstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
promptstack/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── dashboard/        # Dashboard-specific components
│   ├── lib/                  # Utility functions
│   ├── store/                # Zustand state management
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Core Features

### 1. Prompt Editor
- Monaco Editor integration for code-like editing
- Syntax highlighting for prompt templates
- Variable autocomplete and validation
- Real-time collaboration

### 2. Version Control
- Git-like branching and merging
- Diff viewer for prompt changes
- Commit history and rollback
- Collaborative versioning

### 3. A/B Testing
- Side-by-side prompt comparison
- Automated evaluation metrics
- Statistical significance testing
- Winner selection algorithms

### 4. Analytics Dashboard
- Token usage tracking
- Cost analysis and optimization
- Performance metrics
- Success rate monitoring

### 5. Team Collaboration
- Role-based access control
- Real-time editing
- Comment and review system
- Approval workflows

## 🎨 Design System

### Colors
- **Primary**: Indigo (`#6366F1`)
- **Secondary**: Teal (`#00BFA6`)
- **Dark Theme**: GitHub-inspired dark (`#0D1117`)
- **Light Theme**: Clean white (`#F9FAFB`)

### Typography
- **Primary Font**: Inter
- **Monospace**: IBM Plex Mono (for code)
- **Hierarchy**: Clear type scale with proper contrast

### Components
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Multiple variants with hover states
- **Inputs**: Clean, accessible form controls
- **Navigation**: Collapsible sidebar with smooth animations

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js defaults
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality

### Component Guidelines

1. **Use shadcn/ui components** for consistency
2. **Follow the design system** for colors and spacing
3. **Implement proper TypeScript types** for all props
4. **Add proper accessibility attributes**
5. **Use Framer Motion** for smooth animations

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Other Platforms

- **Netlify**: Configure build settings
- **Railway**: Deploy with Docker
- **Self-hosted**: Use Docker Compose

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all TypeScript types are correct
- Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component library
- **Radix UI** for accessible primitives
- **Tailwind CSS** for the utility-first styling
- **Vercel** for the amazing Next.js framework
- **Linear** and **Vercel** for design inspiration

## 📞 Support

- **Documentation**: [docs.promptstack.com](https://docs.promptstack.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/promptstack/issues)
- **Discord**: [Join our community](https://discord.gg/promptstack)
- **Email**: support@promptstack.com

---

Built with ❤️ by the PromptStack team 