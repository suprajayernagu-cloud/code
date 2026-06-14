import fs from 'fs/promises'
import path from 'path'
import { GITHUB_API_BASE, GITHUB_API_HEADERS, LOCAL_DATA_PATH } from '@/src/config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LOGO_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  'Content-Type': 'image/webp',
}

export async function GET(_request, { params }) {
  const slug = String(params?.slug || '').replace(/\.webp$/, '')

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: 'Invalid logo name' }, { status: 400 })
  }

  const localLogo = await readLocalLogo(slug).catch(() => null)
  if (localLogo) {
    return new Response(localLogo, { headers: LOGO_CACHE_HEADERS })
  }

  const remoteLogo = await fetchRemoteLogo(slug).catch(() => null)
  if (remoteLogo) {
    return new Response(remoteLogo, { headers: LOGO_CACHE_HEADERS })
  }

  return Response.json({ error: 'Logo not found' }, { status: 404 })
}

async function readLocalLogo(slug) {
  const dataPath = path.isAbsolute(LOCAL_DATA_PATH)
    ? LOCAL_DATA_PATH
    : path.resolve(process.cwd(), LOCAL_DATA_PATH)
  const logoPath = path.join(path.dirname(dataPath), 'company-logos', `${slug}.webp`)

  return fs.readFile(logoPath)
}

async function fetchRemoteLogo(slug) {
  const response = await fetch(`${GITHUB_API_BASE}/company-logos/${slug}.webp`, {
    headers: {
      Accept: 'application/vnd.github.v3.raw',
      ...GITHUB_API_HEADERS,
    },
    cache: 'no-store',
  })

  if (!response.ok) return null

  return response.arrayBuffer()
}
