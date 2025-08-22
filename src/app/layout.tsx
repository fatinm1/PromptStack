import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Promptrix - GitHub for LLM Prompts & Workflows',
  description: 'Collaborate, version control, and test your LLM prompts with the power of Git-like workflows.',
  keywords: ['LLM', 'prompts', 'AI', 'version control', 'collaboration', 'workflow'],
  authors: [{ name: 'Promptrix Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg?v=1',
    shortcut: '/icon.svg?v=1',
    apple: '/icon.svg?v=1',
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
      <head>
        <link rel="icon" href="/icon.svg?v=1" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                {children}
              </div>
            </AuthProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 