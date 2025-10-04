import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Providers from '@/components/providers/SessionProvider'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TriguṇāScan - Discover Your Gunas",
  description: "Discover your personality through the lens of Sattva, Rajas, and Tamas gunas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="description" content="Discover your personality through the lens of Sattva, Rajas, and Tamas gunas" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
