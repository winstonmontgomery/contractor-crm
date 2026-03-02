import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Contractor Verified ATX - CRM",
  description: "Austin contractor verification and directory service",
}

function Navigation() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M10 12h4"></path>
                <path d="M10 8h4"></path>
                <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg">Contractor Verified</span>
              <span className="text-emerald-400 text-sm ml-1">ATX</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link href="/leads" className="px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium">
              📋 Leads
            </Link>
            <Link href="/contractors" className="px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium">
              👷 Contractors
            </Link>
            <Link href="/admin/prospects" className="px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium">
              🎯 Prospects
            </Link>
            <Link href="/admin/verification" className="px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium">
              📋 Verify
            </Link>
            <Link href="/admin/social" className="px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium">
              🔗 Social
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
