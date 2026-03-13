import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export default function Login() {
  const {
    user,
    profileComplete,
    profileExists,
    loading,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOtp,
  } = useProfile()
  const navigate = useNavigate()

  const [mode, setMode] = useState('choice') // choice | phone | otp
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [welcomeBack, setWelcomeBack] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (loading) return
    if (user) {
      if (profileExists && profileComplete) {
        setWelcomeBack(true)
        setTimeout(() => navigate('/'), 2000)
      } else {
        navigate('/perfil')
      }
    }
  }, [user, loading, profileComplete, profileExists, navigate])

  // Format phone input
  function handlePhoneChange(e) {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 11) val = val.slice(0, 11)
    // Format: (XX) XXXXX-XXXX
    if (val.length > 7) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`
    } else if (val.length > 0) {
      val = `(${val}`
    }
    setPhone(val)
  }

  async function handleGoogle() {
    setError('')
    setSending(true)
    const { error: err } = await signInWithGoogle()
    if (err) setError(err.message)
    setSending(false)
  }

  async function handleSendOtp() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Digite um numero de WhatsApp valido com DDD')
      return
    }
    setError('')
    setSending(true)
    const { error: err } = await signInWithPhone(digits)
    if (err) {
      setError(err.message)
    } else {
      setMode('otp')
    }
    setSending(false)
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) {
      setError('Digite o codigo de 6 digitos')
      return
    }
    setError('')
    setSending(true)
    const digits = phone.replace(/\D/g, '')
    const { error: err } = await verifyPhoneOtp(digits, otp)
    if (err) {
      setError(err.message)
    }
    setSending(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin" />
      </div>
    )
  }

  // Welcome back message
  if (welcomeBack) {
    return (
      <div className="max-w-sm mx-auto text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          ✨
        </div>
        <h1 className="font-display text-2xl text-enchanted mb-2">Bem-vindo de volta!</h1>
        <p className="text-enchanted-muted text-sm italic">
          Seus dados ja estao salvos. Redirecionando...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto animate-fade-in py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-rose-pastel/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-light/40">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-accent">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-enchanted mb-1">Entrar</h1>
        <p className="text-enchanted-muted text-sm italic">
          Faca login para acessar sua conta ou crie uma nova
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-accent/15 border border-rose-accent/30 text-rose-accent text-xs text-center animate-fade-in">
          {error}
        </div>
      )}

      {/* ── Choice: Google or WhatsApp ─────────────────────── */}
      {mode === 'choice' && (
        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={sending}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {sending ? 'Conectando...' : 'Entrar com Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-gold-accent/20" />
            <span className="text-enchanted-muted text-xs italic">ou</span>
            <div className="h-px flex-1 bg-gold-accent/20" />
          </div>

          {/* WhatsApp */}
          <button
            onClick={() => setMode('phone')}
            className="w-full flex items-center justify-center gap-3 border-2 border-[#25D366]/50 text-[#25D366] font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer hover:bg-[#25D366]/10 hover:border-[#25D366] transition-all duration-300"
            style={{ background: 'linear-gradient(145deg, #1A0A12, #22101A)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Entrar com WhatsApp
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-gold-accent/20" />
            <span className="text-enchanted-muted text-xs italic">ou</span>
            <div className="h-px flex-1 bg-gold-accent/20" />
          </div>

          {/* Manual */}
          <button
            onClick={() => navigate('/perfil')}
            className="w-full flex items-center justify-center gap-3 border-2 border-gold-accent/40 text-gold-accent font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer hover:bg-gold-accent/10 hover:border-gold-accent transition-all duration-300"
            style={{ background: 'linear-gradient(145deg, #1A0A12, #22101A)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-accent">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Preencher Manualmente
          </button>

          {/* Info */}
          <p className="text-enchanted-muted text-[11px] text-center italic mt-4">
            Use Google ou WhatsApp para login rapido, ou preencha seus dados manualmente.
          </p>
        </div>
      )}

      {/* ── Phone input ──────────────────────────────────── */}
      {mode === 'phone' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-5">
            <h3 className="font-heading text-xs text-gold-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Numero do WhatsApp
            </h3>

            <p className="text-enchanted-muted text-xs mb-3">
              Digite seu numero com DDD. Enviaremos um codigo de verificacao por SMS.
            </p>

            <div className="flex gap-2">
              <span className="flex items-center px-3 rounded-xl border border-gold-accent/20 text-enchanted-muted text-sm bg-cream-50/50">
                +55
              </span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(51) 99999-9999"
                className="flex-1 input-enchanted rounded-xl px-4 py-2.5 text-sm"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            disabled={sending}
            className="w-full btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg disabled:opacity-50"
          >
            {sending ? 'Enviando...' : 'Enviar Codigo'}
          </button>

          <button
            onClick={() => { setMode('choice'); setError('') }}
            className="w-full text-enchanted-muted text-xs text-center cursor-pointer bg-transparent border-none hover:text-gold-accent transition-colors"
          >
            Voltar
          </button>
        </div>
      )}

      {/* ── OTP verification ────────────────────────────── */}
      {mode === 'otp' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-5 text-center">
            <div className="w-14 h-14 bg-gold-accent/15 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              📱
            </div>
            <h3 className="font-heading text-sm text-enchanted uppercase tracking-widest mb-1">
              Codigo Enviado
            </h3>
            <p className="text-enchanted-muted text-xs mb-4">
              Digite o codigo de 6 digitos enviado para <span className="text-gold-accent">{phone}</span>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="input-enchanted rounded-xl px-4 py-3 text-center text-xl font-heading tracking-[0.5em] w-48 mx-auto block"
              autoFocus
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={sending || otp.length < 6}
            className="w-full btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg disabled:opacity-50"
          >
            {sending ? 'Verificando...' : 'Verificar Codigo'}
          </button>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => { setMode('phone'); setOtp(''); setError('') }}
              className="text-enchanted-muted text-xs cursor-pointer bg-transparent border-none hover:text-gold-accent transition-colors"
            >
              Mudar numero
            </button>
            <button
              onClick={handleSendOtp}
              disabled={sending}
              className="text-gold-accent text-xs cursor-pointer bg-transparent border-none hover:text-gold-deep transition-colors disabled:opacity-50"
            >
              Reenviar codigo
            </button>
          </div>
        </div>
      )}

      {/* Back to home */}
      <div className="text-center mt-6">
        <Link to="/" className="text-enchanted-muted text-xs hover:text-gold-accent transition-colors no-underline">
          Voltar para a Home
        </Link>
      </div>
    </div>
  )
}
