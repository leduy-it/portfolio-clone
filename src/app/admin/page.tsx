import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isAdminRequest } from '@/lib/tracking/admin-auth'
import { buildSummary, recentEvents } from '@/lib/tracking/aggregate'
import { AdminDashboard } from './dashboard'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Not Found',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!(await isAdminRequest())) {
    notFound()
  }
  const [summary, events] = await Promise.all([
    buildSummary({ range: '7d' }),
    recentEvents(50),
  ])
  return <AdminDashboard initialSummary={summary} initialEvents={events} />
}
