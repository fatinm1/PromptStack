import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptStack - GitHub for LLM Prompts & Workflows',
  description: 'Collaborate, version control, and test your LLM prompts with the power of Git-like workflows.',
  keywords: ['LLM', 'prompts', 'AI', 'version control', 'collaboration', 'workflow'],
  authors: [{ name: 'PromptStack Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 