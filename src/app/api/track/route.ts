import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { isBotUA } from '@/lib/tracking/bot-filter'
import { appendEvent, getSalt, hashIdentity, rateLimitOk, TrackEvent } from '@/lib/tracking/store'
import { isAdminRequest } from '@/lib/tracking/admin-auth'

export const runtime = 'nodejs'

const SESSION_COOKIE = 'pf_sid'
const SESSION_TTL = 60 * 60 * 24 * 30

interface IncomingPing {
  path?: unknown
  referrer?: unknown
  screenWidth?: unknown
  screenHeight?: unknown
  locale?: unknown
  ts?: unknown
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return '0.0.0.0'
}

function clientCountry(req: NextRequest): string | null {
  return (
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    req.headers.get('x-country') ||
    null
  )
}

function safePath(input: unknown): string | null {
  if (typeof input !== 'string') return null
  if (input.length === 0 || input.length > 512) return null
  if (!input.startsWith('/')) return null
  return input
}

function safeStr(input: unknown, max: number): string | null {
  if (typeof input !== 'string') return null
  return input.slice(0, max)
}

function safeInt(input: unknown): number | null {
  if (typeof input !== 'number' || !Number.isFinite(input)) return null
  if (input < 0 || input > 100000) return null
  return Math.floor(input)
}

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get('x-admin-self') === '1' && (await isAdminRequest())) {
      return NextResponse.json({ ok: true, skipped: 'admin' })
    }

    const ua = req.headers.get('user-agent')
    if (isBotUA(ua)) {
      return NextResponse.json({ ok: true, skipped: 'bot' })
    }

    const body = (await req.json().catch(() => null)) as IncomingPing | null
    if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 })

    const path = safePath(body.path)
    if (!path) return NextResponse.json({ error: 'bad path' }, { status: 400 })

    const referrer = safeStr(body.referrer, 1024)
    const locale = safeStr(body.locale, 32)
    const screenWidth = safeInt(body.screenWidth)
    const screenHeight = safeInt(body.screenHeight)

    const salt = await getSalt()
    const ip = clientIp(req)
    const ipHash = hashIdentity(['ip', ip], salt)
    const visitorId = hashIdentity(['v', ipHash, ua || ''], salt)

    if (!rateLimitOk(visitorId)) {
      return NextResponse.json({ ok: true, skipped: 'rate' })
    }

    let sessionId = req.cookies.get(SESSION_COOKIE)?.value
    let setSession = false
    if (!sessionId || sessionId.length < 8 || sessionId.length > 64) {
      sessionId = crypto.randomUUID()
      setSession = true
    }

    const country = clientCountry(req)

    const evt: TrackEvent = {
      ts: new Date().toISOString(),
      path,
      referrer: referrer || null,
      userAgent: ua,
      country,
      locale,
      visitorId,
      sessionId,
      screenWidth,
      screenHeight,
    }

    await appendEvent(evt)

    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: setSession ? SESSION_TTL : SESSION_TTL,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
