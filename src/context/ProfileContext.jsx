import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'enchanted-profile'

const ProfileContext = createContext(null)

const EMPTY_PROFILE = {
  nome: '',
  email: '',
  whatsapp: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  avatar: '🎨',
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...EMPTY_PROFILE, ...JSON.parse(saved) } : { ...EMPTY_PROFILE }
    } catch {
      return { ...EMPTY_PROFILE }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const profileComplete = !!(profile.nome && profile.whatsapp)

  function saveProfile(data) {
    setProfile({ ...EMPTY_PROFILE, ...data })
  }

  function updateProfile(data) {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  function clearProfile() {
    setProfile({ ...EMPTY_PROFILE })
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ProfileContext.Provider value={{ profile, profileComplete, saveProfile, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
