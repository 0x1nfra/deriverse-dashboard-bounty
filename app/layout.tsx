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
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon_io/apple-touch-icon.png',
    shortcut: '/favicon_io/favicon.ico',
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
