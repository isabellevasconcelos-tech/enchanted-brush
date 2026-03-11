import { useState } from 'react'

function SplashScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false)

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 800)
  }

  return (
    <div className={`splash-screen ${exiting ? 'splash-exit' : ''}`}>
      <div className="stars-container">
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-8">
        <div className="splash-brand visible">
          <svg width="56" height="56" viewBox="0 0 8 8" className="mx-auto mb-4 animate-float" style={{ filter: 'drop-shadow(0 0 12px rgba(244, 114, 182, 0.6))' }}>
            <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="#F472B6" />
          </svg>
          <h1 className="font-display text-4xl md:text-6xl tracking-wider text-enchanted">
            Enchanted Brush
          </h1>
          <div className="splash-brand-line" />
        </div>

        <button className="splash-button visible" onClick={handleEnter}>
          Entrar no Ateliê
        </button>
      </div>
    </div>
  )
}

export default SplashScreen
