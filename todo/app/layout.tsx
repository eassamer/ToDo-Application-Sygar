import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'Todo App - Stay Organized',
  description: 'A modern todo application built with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
