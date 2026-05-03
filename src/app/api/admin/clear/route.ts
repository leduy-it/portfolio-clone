import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/tracking/admin-auth'
import { clearActive } from '@/lib/tracking/store'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }
  const body = (await req.json().catch(() => null)) as { confirm?: unknown } | null
  if (typeof body?.confirm !== 'string' || body.confirm !== 'delete') {
    return NextResponse.json({ ok: false, error: 'confirm required' }, { status: 400 })
  }
  await clearActive()
  return NextResponse.json({ ok: true })
}
