import { useNavigate } from 'react-router-dom'
import { useStars } from '../context/StarsContext'

export default function StarCounter() {
  const { foundStars, totalStars, justCollected, setJustCollected, showReward, claimReward, rewardClaimed } = useStars()
  const navigate = useNavigate()
  const count = foundStars.size
  const faltam = totalStars - count

  // After reward claimed, entire star system disappears
  if (rewardClaimed) return null

  return (
    <>
      {/* Star Found Overlay */}
      {justCollected && (
        <div
          className="star-found-overlay"
          key={justCollected}
          onClick={() => setJustCollected(null)}
        >
          <div className="star-found-content" onClick={(e) => e.stopPropagation()}>
            {/* Big glowing star */}
            <div className="star-found-big-star">
              <svg width="80" height="80" viewBox="0 0 8 8">
                <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="#FDE68A" />
              </svg>
            </div>

            {/* Radiating particles */}
            <div className="star-found-particles">
              {Array.from({ length: 12 }).map((_, i) => (
                <svg
                  key={i}
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  className="star-found-particle"
                  style={{
                    '--angle': `${i * 30}deg`,
                    '--dist': `${60 + Math.random() * 40}px`,
                    '--delay': `${Math.random() * 0.3}s`,
                  }}
                >
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="#FDE68A" />
                </svg>
              ))}
            </div>

            {/* Message */}
            <p className="star-found-message">
              Você encontrou uma estrela escondida!
            </p>
            <p className="star-found-remaining">
              {faltam > 0
                ? `${faltam === 1 ? 'Falta apenas 1 estrela' : `Faltam ${faltam} estrelas`} para ganhar 5% de desconto!`
                : 'Parabéns! Você encontrou todas as estrelas!'}
            </p>

            {/* Progress dots */}
            <div className="star-found-progress">
              {Array.from({ length: totalStars }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 8 8"
                  className={`star-found-progress-star ${i < count ? 'collected' : ''}`}
                >
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                </svg>
              ))}
            </div>

            <button
              className="star-found-close"
              onClick={() => setJustCollected(null)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Counter */}
      {count > 0 && (
        <button
          className={`star-counter ${justCollected ? 'star-counter-pulse' : ''}`}
          onClick={() => navigate('/hidden-stars')}
          title="Progresso das estrelas"
        >
          <svg width="14" height="14" viewBox="0 0 8 8" className="star-counter-icon">
            <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
          </svg>
          <span className="star-counter-text">Estrelas: {count} / {totalStars}</span>
        </button>
      )}

      {/* Reward Modal - all 7 collected */}
      {showReward && (
        <div className="star-reward-overlay" onClick={claimReward}>
          <div className="star-reward-modal" onClick={(e) => e.stopPropagation()}>
            <div className="star-reward-particles">
              {Array.from({ length: 20 }).map((_, i) => (
                <svg key={i} width={6 + Math.random() * 8} height={6 + Math.random() * 8} viewBox="0 0 8 8" className="star-reward-floating-star" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 2}s` }}>
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="#FDE68A" />
                </svg>
              ))}
            </div>

            <div className="star-reward-stars">
              {Array.from({ length: totalStars }).map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 8 8" className="star-reward-star">
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="#FDE68A" />
                </svg>
              ))}
            </div>

            <h2 className="star-reward-title">Parabéns! Você encontrou todas as estrelas!</h2>
            <p className="star-reward-text">
              Cada estrela era uma assinatura silenciosa do pincel da Isabelle, escondida na arte que ela cria.
              Como recompensa pelo seu olhar atento, você ganhou um desconto especial:
            </p>

            <div className="star-reward-coupon">
              <span className="star-reward-code">STARCOLLECTOR5</span>
              <button className="star-reward-copy" onClick={() => { navigator.clipboard.writeText('STARCOLLECTOR5').catch(() => {}) }}>
                Copiar
              </button>
            </div>

            <p className="star-reward-discount">5% de desconto — será aplicado automaticamente no checkout!</p>

            <button className="star-reward-close" onClick={claimReward}>
              Continuar Explorando
            </button>
          </div>
        </div>
      )}
    </>
  )
}
