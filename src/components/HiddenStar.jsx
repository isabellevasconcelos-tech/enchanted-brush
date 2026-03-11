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
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 8 8"
        className="hidden-star-svg"
      >
        <path
          d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z"
          fill="currentColor"
        />
      </svg>
      {showDust && (
        <span className="hidden-star-dust">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="hidden-star-particle"
              style={{
                '--angle': `${(i * 36)}deg`,
                '--dist': `${16 + Math.random() * 20}px`,
                '--delay': `${Math.random() * 0.15}s`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  )
}
