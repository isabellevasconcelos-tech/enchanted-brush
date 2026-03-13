export default function FloralDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-5 ${className}`}>
      <svg width="320" height="24" viewBox="0 0 320 24" fill="none" className="w-full max-w-xs sm:max-w-sm">
        {/* Linha esquerda */}
        <path d="M0 12 Q30 12 50 12" stroke="url(#goldFade)" strokeWidth="1" />
        {/* Arabesco esquerdo */}
        <path d="M50 12 C55 4, 65 4, 70 12 C75 20, 85 20, 90 12" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M90 12 C95 6, 103 6, 108 12" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* Folha esquerda */}
        <path d="M108 12 C112 7, 120 6, 125 10" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M108 12 C112 17, 120 18, 125 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Linha para centro */}
        <path d="M125 12 L145 12" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />

        {/* Diamante central */}
        <path d="M155 6 L160 12 L155 18 L150 12 Z" fill="#D4AF37" opacity="0.8" />
        <path d="M155 8 L158 12 L155 16 L152 12 Z" fill="#1A0A12" />
        {/* Estrela central */}
        <circle cx="160" cy="12" r="1.5" fill="#D4AF37" opacity="0.9" />

        {/* Diamante central 2 */}
        <path d="M165 6 L170 12 L165 18 L160 12 Z" fill="#D4AF37" opacity="0.8" />
        <path d="M165 8 L168 12 L165 16 L162 12 Z" fill="#1A0A12" />

        {/* Linha para direita */}
        <path d="M175 12 L195 12" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
        {/* Folha direita */}
        <path d="M195 10 C200 6, 208 7, 212 12" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M195 14 C200 18, 208 17, 212 12" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Arabesco direito */}
        <path d="M212 12 C217 6, 225 6, 230 12" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M230 12 C235 20, 245 20, 250 12 C255 4, 265 4, 270 12" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.7" />
        {/* Linha direita */}
        <path d="M270 12 Q290 12 320 12" stroke="url(#goldFadeR)" strokeWidth="1" />

        <defs>
          <linearGradient id="goldFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="goldFadeR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
