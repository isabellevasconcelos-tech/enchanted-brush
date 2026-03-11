import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'

export default function ProfileSetup({ onComplete }) {
  const { saveProfile } = useProfile()

  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
  })

  const [erro, setErro] = useState('')
  const [exiting, setExiting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome.trim()) {
      setErro('Por favor, preencha seu nome.')
      return
    }
    if (!form.whatsapp.trim()) {
      setErro('Por favor, preencha seu WhatsApp.')
      return
    }
    setErro('')
    saveProfile(form)
    setExiting(true)
    setTimeout(onComplete, 600)
  }

  return (
    <div className={`fixed inset-0 z-[9998] flex items-center justify-center bg-cream-100 transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl border border-rose-light/30 p-6 shadow-lg animate-fade-in">
          {/* Header */}
          <div className="text-center mb-6">
            <svg width="36" height="36" viewBox="0 0 8 8" className="mx-auto mb-3 text-rose-accent">
              <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
            </svg>
            <h1 className="font-display text-2xl text-enchanted mb-1">
              Bem-vinda ao Ateliê
            </h1>
            <p className="text-enchanted-muted text-sm italic">
              Preencha seus dados para começar sua experiência
            </p>
          </div>

          {erro && (
            <p className="bg-rose-pastel/50 text-rose-deep p-3 rounded-xl mb-4 text-sm text-center">
              {erro}
            </p>
          )}

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                Nome completo <span className="text-rose-accent">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                placeholder="Maria Silva"
              />
            </div>

            {/* Email + WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  className="w-full input-enchanted rounded-xl px-4 py-2.5 text-sm"
                  placeholder="(51) 99999-9999"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-rose-light/40" />
              <span className="text-enchanted-muted text-xs italic">Endereço de entrega</span>
              <div className="h-px flex-1 bg-rose-light/40" />
            </div>

            {/* CEP */}
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

            {/* Rua + Número */}
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
                  Número
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

            {/* Complemento + Bairro */}
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

            {/* Cidade */}
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
          </div>

          <button
            type="submit"
            className="w-full mt-6 btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Começar
          </button>

          <p className="text-enchanted-muted text-xs text-center mt-3 italic">
            Seus dados ficam salvos no seu dispositivo para facilitar futuras compras.
          </p>
        </form>
      </div>
    </div>
  )
}
