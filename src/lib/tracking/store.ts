import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const ACTIVE_FILE = path.join(DATA_DIR, 'tracking.jsonl')
const SALT_FILE = path.join(DATA_DIR, '.salt')
const MAX_FILE_BYTES = 50 * 1024 * 1024

export interface TrackEvent {
  ts: string
  path: string
  referrer: string | null
  userAgent: string | null
  country: string | null
  locale: string | null
  visitorId: string
  sessionId: string
  screenWidth: number | null
  screenHeight: number | null
}

let cachedSalt: string | null = null

async function ensureDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

export async function getSalt(): Promise<string> {
  if (cachedSalt) return cachedSalt
  if (process.env.TRACKING_SALT) {
    cachedSalt = process.env.TRACKING_SALT
    return cachedSalt
  }
  await ensureDir()
  try {
    cachedSalt = (await fs.readFile(SALT_FILE, 'utf8')).trim()
    if (cachedSalt) return cachedSalt
  } catch {
    /* fall through */
  }
  cachedSalt = crypto.randomBytes(32).toString('hex')
  await fs.writeFile(SALT_FILE, cachedSalt, { mode: 0o600 })
  return cachedSalt
}

export function hashIdentity(parts: string[], salt: string): string {
  return crypto
    .createHash('sha256')
    .update(salt + '|' + parts.join('|'))
    .digest('hex')
    .slice(0, 16)
}

async function rotateIfNeeded(): Promise<void> {
  try {
    const stat = await fs.stat(ACTIVE_FILE)
    if (stat.size < MAX_FILE_BYTES) return
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19)
    const archive = path.join(DATA_DIR, `tracking-${stamp}.jsonl`)
    await fs.rename(ACTIVE_FILE, archive)
  } catch {
    /* file does not exist yet — nothing to rotate */
  }
}

export async function appendEvent(evt: TrackEvent): Promise<void> {
  await ensureDir()
  await rotateIfNeeded()
  await fs.appendFile(ACTIVE_FILE, JSON.stringify(evt) + '\n', 'utf8')
}

export async function readActiveEvents(): Promise<TrackEvent[]> {
  try {
    const raw = await fs.readFile(ACTIVE_FILE, 'utf8')
    const out: TrackEvent[] = []
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue
      try {
        out.push(JSON.parse(line) as TrackEvent)
      } catch {
        /* skip malformed line */
      }
    }
    return out
  } catch {
    return []
  }
}

export async function clearActive(): Promise<void> {
  await ensureDir()
  try {
    const stat = await fs.stat(ACTIVE_FILE)
    if (stat.size > 0) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19)
      await fs.rename(ACTIVE_FILE, path.join(DATA_DIR, `tracking-${stamp}.jsonl`))
    }
  } catch {
    /* nothing to clear */
  }
  await fs.writeFile(ACTIVE_FILE, '', 'utf8')
}

interface Bucket {
  count: number
  resetAt: number
}
const RATE_LIMIT_MAX = 60
const RATE_LIMIT_WINDOW_MS = 60_000
const buckets = new Map<string, Bucket>()

export function rateLimitOk(visitorId: string): boolean {
  const now = Date.now()
  const b = buckets.get(visitorId)
  if (!b || b.resetAt < now) {
    buckets.set(visitorId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (b.count >= RATE_LIMIT_MAX) return false
  b.count += 1
  return true
}
