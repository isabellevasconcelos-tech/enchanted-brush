import { useEffect, useCallback, useRef } from 'react'

export default function TouchSparkle() {
  const containerRef = useRef(null)

  const spawnParticles = useCallback((x, y) => {
    const container = containerRef.current
    if (!container) return

    const count = 6 + Math.floor(Math.random() * 4)

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span')
      particle.className = 'touch-particle'

      const angle = (i / count) * 360
      const dist = 18 + Math.random() * 28
      const size = 2 + Math.random() * 3
      const duration = 0.5 + Math.random() * 0.4

      particle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        --angle: ${angle}deg;
        --dist: ${dist}px;
        animation-duration: ${duration}s;
        animation-delay: ${Math.random() * 0.1}s;
      `

      container.appendChild(particle)
      setTimeout(() => particle.remove(), duration * 1000 + 150)
    }

    // Central flash
    const flash = document.createElement('span')
    flash.className = 'touch-flash'
    flash.style.cssText = `left: ${x}px; top: ${y}px;`
    container.appendChild(flash)
    setTimeout(() => flash.remove(), 500)
  }, [])

  useEffect(() => {
    function handleTouch(e) {
      const touch = e.changedTouches?.[0]
      if (touch) {
        spawnParticles(touch.clientX, touch.clientY)
      }
    }

    function handleClick(e) {
      // Only on non-touch devices or as fallback
      if ('ontouchstart' in window) return
      spawnParticles(e.clientX, e.clientY)
    }

    document.addEventListener('touchstart', handleTouch, { passive: true })
    document.addEventListener('click', handleClick, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouch)
      document.removeEventListener('click', handleClick)
    }
  }, [spawnParticles])

  return <div ref={containerRef} className="touch-sparkle-container" />
}
