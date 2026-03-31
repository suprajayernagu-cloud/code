import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivacySettingsButton({ className = '' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const googlefc = window.googlefc

      if (googlefc?.callbackQueue && googlefc.showRevocationMessage) {
        googlefc.callbackQueue.push(googlefc.showRevocationMessage)
        return
      }
    }

    navigate('/privacy')
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      Privacy and cookie settings
    </button>
  )
}
