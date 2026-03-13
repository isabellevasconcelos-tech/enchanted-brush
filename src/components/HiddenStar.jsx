import { useState } from 'react'
import { useStars } from '../context/StarsContext'

export default function HiddenStar({ id, className = '' }) {
  const { collectStar, isCollected, rewardClaimed } = useStars()
  const [showDust, setShowDust] = useState(false)
  const collected = isCollected(id)

  // After reward claimed, stars disappear completely
  if (rewardClaimed) return null

  function handleClick(e) {
    e.stopPropagation()
    e.preventDefault()
    if (collected) return
    setShowDust(true)
    collectStar(id)
    setTimeout(() => setShowDust(false), 900)
  }

  return (
    <button
      className={`hidden-star ${collected ? 'found' : ''} ${className}`}
      onClick={handleClick}
      aria-label="Hidden star"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        padding: '10px',
        cursor: collected ? 'default' : 'pointer',
        zIndex: 10,
      }}
    >
      {/* Outer glow ring */}
      {!collected && (
        <span
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 30, 30, 0.6)',
            animation: 'star-ring-pulse 1.8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Second glow ring (bigger, softer) */}
      {!collected && (
        <span
          style={{
            position: 'absolute',
            inset: '-14px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 30, 30, 0.3)',
            animation: 'star-ring-pulse 1.8s ease-in-out infinite 0.4s',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Background glow blob */}
      {!collected && (
        <span
          style={{
            position: 'absolute',
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,20,20,0.45) 0%, rgba(255,60,60,0.2) 40%, transparent 70%)',
            animation: 'star-idle-pulse 1.8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <svg
        width={collected ? '24' : '32'}
        height={collected ? '24' : '32'}
        viewBox="0 0 24 24"
        style={{
          position: 'relative',
          zIndex: 1,
          filter: collected
            ? 'drop-shadow(0 0 3px rgba(255,30,30,0.2))'
            : 'drop-shadow(0 0 10px rgba(255,20,20,0.9)) drop-shadow(0 0 25px rgba(255,60,60,0.5)) drop-shadow(0 0 40px rgba(255,0,0,0.3))',
          animation: collected ? 'none' : 'star-idle-pulse 1.8s ease-in-out infinite',
          transition: 'transform 0.4s ease, filter 0.4s ease',
          opacity: collected ? 0.3 : 1,
        }}
      >
        <defs>
          <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FF4444" />
            <stop offset="30%" stopColor="#FF0000" />
            <stop offset="60%" stopColor="#CC0000" />
            <stop offset="100%" stopColor="#FF2222" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#sg-${id})`}
          stroke="#FF3333"
          strokeWidth="0.8"
        />
      </svg>

      {showDust && (
        <span className="hidden-star-dust">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="hidden-star-particle"
              style={{
                '--angle': `${(i * 25.7)}deg`,
                '--dist': `${20 + Math.random() * 28}px`,
                '--delay': `${Math.random() * 0.15}s`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  )
}
