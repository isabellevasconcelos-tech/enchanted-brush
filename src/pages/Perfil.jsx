import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabase'
import FloralDivider from '../components/FloralDivider'

const AVATARS = [
  { emoji: '🎨', label: 'Paleta' },
  { emoji: '🖌️', label: 'Pincel' },
  { emoji: '✨', label: 'Brilho' },
  { emoji: '🦋', label: 'Borboleta' },
  { emoji: '🌸', label: 'Flor' },
  { emoji: '🌈', label: 'Arco-iris' },
  { emoji: '💎', label: 'Diamante' },
  { emoji: '🪻', label: 'Lavanda' },
  { emoji: '🌺', label: 'Hibisco' },
  { emoji: '🎭', label: 'Artes' },
  { emoji: '🧵', label: 'Linha' },
  { emoji: '🪄', label: 'Varinha' },
]

const ETAPAS = [
  { key: 'pendente', label: 'Pendente', icon: '⏳' },
  { key: 'fabricando', label: 'Fabricando', icon: '🖌️' },
  { key: 'a caminho', label: 'A Caminho', icon: '🚚' },
  { key: 'entregue', label: 'Entregue', icon: '✅' },
]

function LinhaProgresso({ status }) {
  const idx = ETAPAS.findIndex((e) => e.key === status)
  const etapaAtual = idx >= 0 ? idx : 0

  return (
    <div className="flex items-center w-full mt-3">
      {ETAPAS.map((etapa, i) => {
        const concluida = i <= etapaAtual
        return (
          <div key={etapa.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 ${
                  concluida
                    ? 'bg-green-100 border-green-400 shadow-md'
                    : 'bg-rose-pastel/30 border-rose-light/40'
                }`}
              >
                {etapa.icon}
              </div>
              <span
                className={`text-[10px] mt-1 font-heading tracking-wide ${
                  concluida ? 'text-green-600' : 'text-enchanted-muted'
                }`}
              >
                {etapa.label}
              </span>
            </div>
            {i < ETAPAS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${
                  i < etapaAtual ? 'bg-green-400' : 'bg-rose-light/40'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Perfil() {
  const { user, profile, profileComplete, profileExists, loading, saveProfile, signOut } = useProfile()
  const navigate = useNavigate()

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ ...profile })
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [editandoAvatar, setEditandoAvatar] = useState(false)

  // Pedidos
  const [pedidos, setPedidos] = useState([])
  const [carregandoPedidos, setCarregandoPedidos] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Start in edit mode if profile is not complete
  useEffect(() => {
    if (!loading && user && !profileExists) {
      setEditando(true)
      setForm({ ...profile })
    }
  }, [loading, user, profileExists, profile])

  // Sync form when profile changes (after fetch)
  useEffect(() => {
    if (!editando) {
      setForm({ ...profile })
    }
  }, [profile])

  // Fetch orders
  useEffect(() => {
    if (!profile.whatsapp || !profileComplete) return
    setCarregandoPedidos(true)
    supabase
      .from('pedidos')
      .select('*')
      .eq('telefone_cliente', profile.whatsapp)
      .order('criado_em', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPedidos(data)
        setCarregandoPedidos(false)
      })
  }, [profile.whatsapp, profileComplete])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErro('')
  }

  async function handleCepBlur() {
    const cepLimpo = form.cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (data.erro) return
      setForm((prev) => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade ? `${data.localidade} - ${data.uf}` : '',
      }))
    } catch {
      // user can fill manually
    }
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    const { error } = await saveProfile(form)

    if (error) {
      setErro(error.message)
      setSalvando(false)
      return
    }

    setSalvo(true)
    setEditando(false)
    setSalvando(false)
    setTimeout(() => setSalvo(false), 2000)
  }

  function handleEditar() {
    setForm({ ...profile })
    setEditando(true)
    setEditandoAvatar(false)
    setErro('')
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="papyrus-scroll">
        <div className="papyrus-roll papyrus-roll-top" />
        <div className="papyrus-body">

      <div className="text-center mb-4">
        <h1 className="papyrus-title" style={{ fontSize: '2rem' }}>Meu Perfil</h1>
        <p className="papyrus-subtitle">
          {!profileExists
            ? 'Crie sua conta preenchendo seus dados'
            : editando
              ? 'Edite seus dados pessoais'
              : 'Seus dados e pedidos'}
        </p>
        {!profileExists && (
          <div className="mt-3 p-3 rounded-xl bg-gold-accent/10 border border-gold-accent/30 max-w-sm mx-auto">
            <p className="text-gold-accent text-xs font-heading tracking-wide">
              Voce ainda nao tem uma conta. Preencha todos os campos obrigatorios para criar.
            </p>
          </div>
        )}
      </div>

      <FloralDivider className="mb-6" />

      {editando ? (
        /* ======================== MODO EDICAO ======================== */
        <form onSubmit={handleSalvar} className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-6 space-y-4">
          {/* Error */}
          {erro && (
            <div className="p-3 rounded-xl bg-rose-accent/15 border border-rose-accent/30 text-rose-accent text-xs text-center animate-fade-in">
              {erro}
            </div>
          )}

          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-rose-pastel/40 border-2 border-rose-light/50 flex items-center justify-center text-4xl shadow-inner">
              {form.avatar || '🎨'}
            </div>
            {editandoAvatar ? (
              <>
                <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                  Escolha seu avatar
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, avatar: av.emoji }))
                        setEditandoAvatar(false)
                      }}
                      title={av.label}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all duration-200 border-2 ${
                        form.avatar === av.emoji
                          ? 'border-rose-accent bg-rose-pastel/50 shadow-md scale-110'
                          : 'border-rose-light/30 bg-cream-50 hover:border-rose-medium hover:scale-105'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditandoAvatar(true)}
                className="text-rose-accent hover:text-rose-deep text-xs font-heading tracking-wide cursor-pointer bg-transparent border-none transition-colors"
              >
                Trocar avatar
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-rose-light/40" />
            <span className="text-enchanted-muted text-xs italic">Dados pessoais *</span>
            <div className="h-px flex-1 bg-rose-light/40" />
          </div>

          <div>
            <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
              Nome completo <span className="text-rose-accent">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
              placeholder="Maria Silva"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                E-mail <span className="text-rose-accent">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="maria@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                WhatsApp <span className="text-rose-accent">*</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                required
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="(51) 99999-9999"
              />
            </div>
          </div>

          <p className="text-enchanted-muted text-[10px] italic text-center">
            * Campos obrigatorios. Todos devem ser preenchidos para criar sua conta.
          </p>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-rose-light/40" />
            <span className="text-enchanted-muted text-xs italic">Endereco de entrega</span>
            <div className="h-px flex-1 bg-rose-light/40" />
          </div>

          <div className="max-w-[200px]">
            <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
              CEP
            </label>
            <input
              type="text"
              name="cep"
              value={form.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
              placeholder="00000-000"
              maxLength={9}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                Rua
              </label>
              <input
                type="text"
                name="rua"
                value={form.rua}
                onChange={handleChange}
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="Rua das Flores"
              />
            </div>
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                Numero
              </label>
              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                Complemento <span className="normal-case tracking-normal text-enchanted-muted">(opcional)</span>
              </label>
              <input
                type="text"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="Apto 101"
              />
            </div>
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                Bairro
              </label>
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="Centro"
              />
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
              Cidade
            </label>
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
              placeholder="Porto Alegre - RS"
            />
          </div>

          <div className="flex gap-3">
            {profileExists && (
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="flex-1 bg-cream-50 border border-rose-light/50 text-enchanted-muted font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer hover:bg-rose-pastel/20 transition-all duration-300"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : salvo ? 'Salvo!' : profileExists ? 'Salvar' : 'Criar Conta'}
            </button>
          </div>
        </form>
      ) : (
        /* ======================== MODO LEITURA ======================== */
        <div className="space-y-6">
          {/* Saved notification */}
          {salvo && (
            <div className="p-3 rounded-xl bg-green-900/20 border border-green-500/30 text-green-400 text-xs text-center animate-fade-in">
              Perfil salvo com sucesso!
            </div>
          )}

          {/* Avatar + Nome */}
          <div className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-rose-pastel/40 border-2 border-rose-light/50 flex items-center justify-center text-5xl shadow-inner">
              {profile.avatar || '🎨'}
            </div>
            <h2 className="font-display text-xl text-enchanted mb-1">{profile.nome}</h2>
            {profile.email && (
              <p className="text-enchanted-muted text-sm">{profile.email}</p>
            )}
            {profile.whatsapp && (
              <p className="text-enchanted-muted text-sm">{profile.whatsapp}</p>
            )}
          </div>

          {/* Endereco */}
          {profile.rua && (
            <div className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-5">
              <h3 className="font-heading text-sm text-[#C8962E] uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C8962E]">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Endereco de Entrega
              </h3>
              <div className="text-sm text-enchanted-muted space-y-0.5">
                <p>{profile.rua}, {profile.numero}{profile.complemento ? ` - ${profile.complemento}` : ''}</p>
                <p>{profile.bairro}, {profile.cidade}</p>
                {profile.cep && <p>CEP: {profile.cep}</p>}
              </div>
            </div>
          )}

          {/* Botoes */}
          <div className="flex gap-3">
            <button
              onClick={handleEditar}
              className="flex-1 bg-[#2a1f14]/40 border border-[#C8962E]/40 text-[#C8962E] hover:text-[#D4AF37] hover:border-[#C8962E] font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Editar
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-rose-pastel/20 border border-rose-accent/30 text-rose-accent hover:bg-rose-pastel/40 hover:border-rose-accent/50 font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}

      {/* ======================== MEUS PEDIDOS ======================== */}
      {profileComplete && (
        <div className="mt-8">
          <div className="text-center mb-4">
            <h2 className="papyrus-title" style={{ fontSize: '1.6rem' }}>Meus Pedidos</h2>
            <p className="papyrus-subtitle">Acompanhe o status das suas encomendas</p>
          </div>

          <FloralDivider className="mb-6" />

          {carregandoPedidos ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-rose-light border-t-rose-accent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-enchanted-muted text-sm italic">Carregando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-8 text-center">
              <div className="w-14 h-14 bg-[#C8962E]/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                📦
              </div>
              <p className="font-heading text-sm text-[#e8d5b0] mb-1">Nenhum pedido ainda</p>
              <p className="text-[#b8a080] text-xs italic">
                Quando voce fizer sua primeira compra, o acompanhamento aparecera aqui!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-[#2a1f14]/40 rounded-2xl border border-[#C8962E]/20 p-5"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-heading text-sm text-enchanted">
                        Pedido #{pedido.id}
                      </p>
                      <p className="text-enchanted-muted text-xs">
                        {pedido.criado_em && formatDate(pedido.criado_em)}
                      </p>
                    </div>
                    <span className="text-xs font-heading text-rose-accent bg-rose-pastel/30 px-2.5 py-1 rounded-full">
                      Tam: {pedido.tamanho} &middot; Qtd: {pedido.quantidade}
                    </span>
                  </div>

                  {pedido.observacoes && (
                    <p className="text-enchanted-muted text-xs italic mt-1 mb-2">
                      {pedido.observacoes.split('|')[0].trim()}
                    </p>
                  )}

                  <LinhaProgresso status={pedido.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        </div>
        <div className="papyrus-roll papyrus-roll-bottom" />
      </div>
    </div>
  )
}
