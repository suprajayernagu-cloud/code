import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL } from '../config'

function buildCanonicalUrl(pathname) {
  if (!pathname || pathname === '/') return SITE_URL
  return `${SITE_URL}${pathname}`
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(key, value)
    }
  })
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(key, value)
    }
  })
}

function removeManagedJsonLd() {
  document.head.querySelectorAll('script[data-page-meta-jsonld="true"]').forEach((script) => {
    script.remove()
  })
}

export default function PageMeta({
  title,
  description,
  canonicalPath,
  canonicalUrl,
  robots = 'index,follow,max-image-preview:large',
  ogType = 'website',
  jsonLd,
}) {
  const location = useLocation()

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const url = canonicalUrl || buildCanonicalUrl(canonicalPath ?? location.pathname)

    if (title) {
      document.title = title
    }

    if (description) {
      upsertMeta('meta[name="description"]', {
        name: 'description',
        content: description,
      })
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      })
      upsertMeta('meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: description,
      })
    }

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots,
    })

    if (title) {
      upsertMeta('meta[property="og:title"]', {
        property: 'og:title',
        content: title,
      })
      upsertMeta('meta[name="twitter:title"]', {
        name: 'twitter:title',
        content: title,
      })
    }

    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: ogType,
    })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: url,
    })

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: url,
    })

    removeManagedJsonLd()

    const entries = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

    entries.forEach((entry) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.pageMetaJsonld = 'true'
      script.textContent = JSON.stringify(entry)
      document.head.appendChild(script)
    })

    return () => {
      removeManagedJsonLd()
    }
  }, [canonicalPath, canonicalUrl, description, jsonLd, location.pathname, ogType, robots, title])

  return null
}
