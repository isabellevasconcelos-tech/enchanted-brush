import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export default function ProfileBanner() {
  const { user, profileComplete, loading } = useProfile()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  if (loading || dismissed) return null

  // Not logged in → prompt login
  if (!user) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[998] animate-fade-in">
        <div className="bg-cream-50/95 backdrop-blur-sm border-t border-rose-light/40 shadow-[0_-4px_20px_rgba(200,150,46,0.1)] px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-accent">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="15" y1="12" x2="3" y2="12" strokeLinecap="round" />
              </svg>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="flex-1 text-left bg-transparent border-none cursor-pointer p-0"
            >
              <p className="font-heading text-sm text-enchanted leading-tight">
                Faca login
              </p>
              <p className="text-enchanted-muted text-xs italic leading-tight mt-0.5">
                Entre para salvar seus dados e acompanhar pedidos
              </p>
            </button>
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

  // Logged in but profile incomplete → prompt complete profile
  if (!profileComplete) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[998] animate-fade-in">
        <div className="bg-cream-50/95 backdrop-blur-sm border-t border-rose-light/40 shadow-[0_-4px_20px_rgba(200,150,46,0.1)] px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-pastel/50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rose-accent">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              onClick={() => navigate('/perfil')}
              className="flex-1 text-left bg-transparent border-none cursor-pointer p-0"
            >
              <p className="font-heading text-sm text-enchanted leading-tight">
                Complete seu perfil
              </p>
              <p className="text-enchanted-muted text-xs italic leading-tight mt-0.5">
                Preencha seus dados para poder realizar suas compras
              </p>
            </button>
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

  return null
}
