'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function PrivacySettingsButton({ className = '' }) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const googlefc = window.googlefc

      if (googlefc?.callbackQueue && googlefc.showRevocationMessage) {
        googlefc.callbackQueue.push(googlefc.showRevocationMessage)
        return
      }
    }

    router.push('/privacy')
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      Privacy and cookie settings
    </button>
  )
}
