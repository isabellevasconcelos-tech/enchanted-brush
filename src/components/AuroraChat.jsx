import { useState } from 'react'
import AuroraChatPanel from './AuroraChatPanel'

export default function AuroraChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat panel */}
      {isOpen && <AuroraChatPanel onClose={() => setIsOpen(false)} />}

      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
        style={{
          background: 'linear-gradient(135deg, #C8962E 0%, #D4AF37 50%, #C8962E 100%)',
          border: '2px solid #D4AF37',
          boxShadow: '0 0 20px rgba(200,150,46,0.4), 0 4px 16px rgba(62,43,24,0.3)',
          animation: 'aurora-pulse 3s ease-in-out infinite',
        }}
        title="Fale com Aurora"
      >
        {/* Star icon */}
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        )}

        {/* Glow ring animation */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: '2px solid rgba(212,175,55,0.5)',
              animation: 'aurora-ring 3s ease-in-out infinite',
            }}
          />
        )}
      </button>

      {/* CSS animations */}
      <style>{`
        @keyframes aurora-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(200,150,46,0.4), 0 4px 16px rgba(62,43,24,0.3); }
          50% { box-shadow: 0 0 30px rgba(212,175,55,0.6), 0 4px 20px rgba(62,43,24,0.4); }
        }
        @keyframes aurora-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </>
  )
}
