import React from "react"
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TopNavigation } from '@/components/top-navigation'
import './globals.css'

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Deriverse - Trading Journal & Portfolio Analytics',
  description: 'Track your perpetual futures trades, analyze performance, and improve your trading strategy',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${figtree.className} antialiased bg-background text-foreground min-h-screen`}>
        <TopNavigation />
        <main className="pt-16">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
