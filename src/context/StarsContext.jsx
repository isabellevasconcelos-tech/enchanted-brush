import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'enchanted-stars-found'
const REWARD_KEY = 'enchanted-stars-reward-claimed'
const TOTAL_STARS = 7

const StarsContext = createContext(null)

export function StarsProvider({ children }) {
  const [rewardClaimed, setRewardClaimed] = useState(
    () => localStorage.getItem(REWARD_KEY) === 'true'
  )

  const [foundStars, setFoundStars] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [justCollected, setJustCollected] = useState(null)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...foundStars]))
  }, [foundStars])

  function claimReward() {
    setShowReward(false)
    setRewardClaimed(true)
    localStorage.setItem(REWARD_KEY, 'true')
  }

  const collectStar = useCallback((id) => {
    setFoundStars((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      if (next.size === TOTAL_STARS) {
        setTimeout(() => setShowReward(true), 1500)
      }
      return next
    })
    setJustCollected(id)
    setTimeout(() => setJustCollected(null), 2000)
  }, [])

  const isCollected = useCallback((id) => foundStars.has(id), [foundStars])

  return (
    <StarsContext.Provider value={{
      foundStars,
      totalStars: TOTAL_STARS,
      collectStar,
      isCollected,
      justCollected,
      setJustCollected,
      showReward,
      setShowReward,
      rewardClaimed,
      claimReward,
    }}>
      {children}
    </StarsContext.Provider>
  )
}

export function useStars() {
  const ctx = useContext(StarsContext)
  if (!ctx) throw new Error('useStars must be used within StarsProvider')
  return ctx
}
