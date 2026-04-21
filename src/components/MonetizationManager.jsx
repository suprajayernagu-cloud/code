'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ADSENSE_CLIENT_ID, ENABLE_ADSENSE_SCRIPT, PRIVACY_MESSAGE_SCRIPT_URL } from '../config'

const ADSENSE_SCRIPT_ID = 'google-adsense-script'
const PRIVACY_MESSAGE_SCRIPT_ID = 'google-privacy-message-script'

function ensureScript({ id, src, attributes = {} }) {
  if (!src || document.getElementById(id)) return

  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = true

  Object.entries(attributes).forEach(([key, value]) => {
    script.setAttribute(key, value)
  })

  document.head.appendChild(script)
}

function removeScript(id) {
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}

export default function MonetizationManager() {
  const pathname = usePathname()
  const isPrivacyDisclosurePage = pathname === '/privacy'

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev || isPrivacyDisclosurePage) {
      removeScript(PRIVACY_MESSAGE_SCRIPT_ID)
      removeScript(ADSENSE_SCRIPT_ID)
      return
    }

    if (PRIVACY_MESSAGE_SCRIPT_URL) {
      ensureScript({
        id: PRIVACY_MESSAGE_SCRIPT_ID,
        src: PRIVACY_MESSAGE_SCRIPT_URL,
      })
    }

    if (ENABLE_ADSENSE_SCRIPT && ADSENSE_CLIENT_ID) {
      ensureScript({
        id: ADSENSE_SCRIPT_ID,
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
        attributes: {
          crossorigin: 'anonymous',
        },
      })
    }
  }, [isPrivacyDisclosurePage])

  return null
}
