import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export default function ProfileBanner() {
  const { profileComplete } = useProfile()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  if (profileComplete || dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[998] animate-fade-in">
      <div className="bg-cream-50/95 backdrop-blur-sm border-t border-rose-light/40 shadow-[0_-4px_20px_rgba(200,150,46,0.1)] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 bg-rose-pastel/50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rose-accent">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Text - clickable */}
          <button
            onClick={() => navigate('/perfil')}
            className="flex-1 text-left bg-transparent border-none cursor-pointer p-0"
          >
            <p className="font-heading text-sm text-enchanted leading-tight">
              Complete seu perfil
            </p>
            <p className="text-enchanted-muted text-xs italic leading-tight mt-0.5">
              Preencha seus dados para poder realizar suas compras com carinho!
            </p>
          </button>

          {/* Close */}
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-enchanted-muted hover:text-rose-deep hover:bg-rose-pastel/30 transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
