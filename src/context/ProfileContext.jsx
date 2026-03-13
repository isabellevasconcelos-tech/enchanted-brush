import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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

// localStorage helpers for manual (no-auth) profiles
const LOCAL_PROFILE_KEY = 'enchanted_profile'
function loadLocalProfile() {
  try {
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}
function saveLocalProfile(data) {
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data))
}

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null)
  const localData = loadLocalProfile()
  const [profile, setProfile] = useState(localData ? { ...EMPTY_PROFILE, ...localData } : { ...EMPTY_PROFILE })
  const [loading, setLoading] = useState(true)
  const [profileExists, setProfileExists] = useState(!!localData)

  // Fetch profile from Supabase perfis table
  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setProfile({ ...EMPTY_PROFILE, ...data })
      setProfileExists(true)
    } else {
      // Profile doesn't exist yet — pre-fill from auth user metadata
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setProfile((prev) => ({
          ...prev,
          email: authUser.email || '',
          nome: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          whatsapp: authUser.phone || '',
        }))
      }
      setProfileExists(false)
    }
    setLoading(false)
  }, [])

  // Listen to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          await fetchProfile(u.id)
        } else {
          setProfile({ ...EMPTY_PROFILE })
          setProfileExists(false)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Profile is complete when required fields are filled AND saved (to DB or localStorage)
  const profileComplete = !!(profileExists && profile.nome && profile.whatsapp && profile.email)

  // Save full profile to Supabase (or localStorage if no auth)
  async function saveProfile(data) {
    // Validate required fields
    if (!data.nome?.trim()) return { error: { message: 'Nome e obrigatorio' } }
    if (!data.email?.trim()) return { error: { message: 'E-mail e obrigatorio' } }
    if (!data.whatsapp?.trim()) return { error: { message: 'WhatsApp e obrigatorio' } }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      return { error: { message: 'E-mail invalido' } }
    }

    // Validate phone (at least 10 digits)
    const phoneDigits = data.whatsapp.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      return { error: { message: 'Numero de WhatsApp invalido' } }
    }

    const profileData = {
      nome: data.nome.trim(),
      email: data.email.trim(),
      whatsapp: data.whatsapp.trim(),
      cep: data.cep || '',
      rua: data.rua || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.cidade || '',
      avatar: data.avatar || '🎨',
    }

    if (user) {
      // Save to Supabase
      const { error } = await supabase
        .from('perfis')
        .upsert({ id: user.id, ...profileData })

      if (error) return { error }
    }

    // Always save to localStorage as backup
    saveLocalProfile(profileData)
    setProfile(profileData)
    setProfileExists(true)

    return { error: null }
  }

  // Partial update
  async function updateProfile(data) {
    if (!user) return { error: { message: 'Voce precisa estar logado' } }
    const updated = { ...profile, ...data }
    return saveProfile(updated)
  }

  // Auth: Google OAuth
  async function signInWithGoogle() {
    sessionStorage.setItem('oauth_pending', '1')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    return { error }
  }

  // Auth: Send phone OTP
  async function signInWithPhone(phone) {
    // Format to E.164
    const digits = phone.replace(/\D/g, '')
    const formatted = digits.startsWith('55') ? `+${digits}` : `+55${digits}`

    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    return { error }
  }

  // Auth: Verify phone OTP
  async function verifyPhoneOtp(phone, token) {
    const digits = phone.replace(/\D/g, '')
    const formatted = digits.startsWith('55') ? `+${digits}` : `+55${digits}`

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token,
      type: 'sms',
    })
    return { data, error }
  }

  // Logout
  async function signOut() {
    await supabase.auth.signOut()
    setProfile({ ...EMPTY_PROFILE })
    setProfileExists(false)
    setUser(null)
  }

  function clearProfile() {
    signOut()
  }

  return (
    <ProfileContext.Provider
      value={{
        user,
        profile,
        profileComplete,
        profileExists,
        loading,
        saveProfile,
        updateProfile,
        clearProfile,
        signInWithGoogle,
        signInWithPhone,
        verifyPhoneOtp,
        signOut,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
