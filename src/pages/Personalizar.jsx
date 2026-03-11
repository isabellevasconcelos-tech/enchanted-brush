import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabase'
import ChatMessage from '../components/chat/ChatMessage'
import ChatImagePicker from '../components/chat/ChatImagePicker'
import ChatSummary from '../components/chat/ChatSummary'

const WHATSAPP_NUMBER = '5551993777539'

const BOT_MESSAGES = {
  0: 'Oi! Quer criar uma camisa unica, pintada a mao so pra voce? Vamos montar juntos!',
  1: 'Primeiro, me manda uma imagem de referencia. Pode ser uma foto sua, do nosso catalogo ou uma inspiracao da internet!',
  2: 'Adorei a referencia! Agora me conta: que estilo ou tema voce quer na camisa? (Ex: floral, abstrato, personagem, paisagem...)',
  3: 'Perfeito! E quais cores voce prefere? (Ex: tons de azul e verde, cores quentes, preto e dourado...)',
  4: 'Otimo! Qual tamanho?',
  5: 'E qual modelagem voce prefere?',
  6: 'Quase la! Tem algum detalhe extra que eu precise saber? (posicao da arte, frase, algo especifico...)',
  7: 'Resumo do seu pedido:',
}

export default function Personalizar() {
  const { profile, profileComplete } = useProfile()
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [formData, setFormData] = useState({
    imagemUrl: '',
    imagemTipo: '',
    estiloTema: '',
    cores: '',
    tamanho: '',
    modelagem: '',
    observacoes: '',
  })
  const [inputValue, setInputValue] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const msgIdRef = useRef(0)

  function nextId() {
    msgIdRef.current += 1
    return msgIdRef.current
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showImagePicker])

  // Push the initial bot message for each step
  const pushBotMessage = useCallback((stepNum) => {
    const content = BOT_MESSAGES[stepNum]
    if (!content) return

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), sender: 'bot', content },
      ])

      // Auto-show image picker on step 1
      if (stepNum === 1) {
        setTimeout(() => setShowImagePicker(true), 400)
      }
    }, 500)
  }, [])

  // Start the conversation
  useEffect(() => {
    if (messages.length === 0) {
      pushBotMessage(0)
    }
  }, [])

  // Focus input when reaching text steps
  useEffect(() => {
    if ([2, 3, 6].includes(step)) {
      setTimeout(() => inputRef.current?.focus(), 600)
    }
  }, [step])

  function advanceStep(nextStep) {
    setStep(nextStep)
    pushBotMessage(nextStep)
  }

  function addUserMessage(content, imageUrl) {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), sender: 'user', content, imageUrl },
    ])
  }

  // Step 0: "Vamos la!"
  function handleStart() {
    addUserMessage('Vamos la!')
    advanceStep(1)
  }

  // Step 1: Image selected
  function handleImageSelected(url, tipo) {
    setFormData((prev) => ({ ...prev, imagemUrl: url, imagemTipo: tipo }))
    setShowImagePicker(false)
    addUserMessage(
      tipo === 'upload' ? 'Enviei minha foto!' : tipo === 'catalogo' ? 'Escolhi do catalogo!' : 'Achei essa inspiracao!',
      url
    )
    advanceStep(2)
  }

  // Step 2, 3, 6: Text input submission
  function handleTextSubmit(e) {
    e?.preventDefault()
    const value = inputValue.trim()
    if (!value && step !== 6) return

    if (step === 2) {
      setFormData((prev) => ({ ...prev, estiloTema: value }))
      addUserMessage(value)
      setInputValue('')
      advanceStep(3)
    } else if (step === 3) {
      setFormData((prev) => ({ ...prev, cores: value }))
      addUserMessage(value)
      setInputValue('')
      advanceStep(4)
    } else if (step === 6) {
      setFormData((prev) => ({ ...prev, observacoes: value }))
      addUserMessage(value || 'Sem detalhes extras')
      setInputValue('')
      advanceStep(7)
    }
  }

  // Step 4: Size selection
  function handleTamanho(tam) {
    setFormData((prev) => ({ ...prev, tamanho: tam }))
    addUserMessage(tam)
    advanceStep(5)
  }

  // Step 5: Fit selection
  function handleModelagem(mod) {
    setFormData((prev) => ({ ...prev, modelagem: mod }))
    addUserMessage(mod === 'babylook' ? 'Baby Look' : 'Slim')
    advanceStep(6)
  }

  // Step 6: Skip observations
  function handleSkipObs() {
    setFormData((prev) => ({ ...prev, observacoes: '' }))
    addUserMessage('Sem detalhes extras')
    advanceStep(7)
  }

  // Step 7: Go back to step 1 to redo
  function handleVoltar() {
    setMessages([])
    setStep(0)
    setFormData({
      imagemUrl: '',
      imagemTipo: '',
      estiloTema: '',
      cores: '',
      tamanho: '',
      modelagem: '',
      observacoes: '',
    })
    setShowImagePicker(false)
    msgIdRef.current = 0
    setTimeout(() => pushBotMessage(0), 100)
  }

  // Step 7: Confirm and submit
  async function handleConfirmar() {
    setEnviando(true)

    const { error } = await supabase.from('encomendas').insert({
      nome: profile.nome,
      email: profile.email || '',
      telefone: profile.whatsapp,
      tamanho: formData.tamanho,
      modelagem: formData.modelagem,
      descricao_arte: formData.estiloTema,
      cores_preferidas: formData.cores,
      observacoes: formData.observacoes || null,
      imagem_referencia_url: formData.imagemUrl,
      imagem_tipo: formData.imagemTipo,
    })

    if (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), sender: 'bot', content: 'Ops, deu um erro ao salvar. Tente novamente!' },
      ])
      setEnviando(false)
      return
    }

    // Build WhatsApp message
    const msg =
      `Ola! Gostaria de encomendar uma camisa personalizada:\n\n` +
      `*Referencia:* ${formData.imagemUrl}\n` +
      `*Estilo/Tema:* ${formData.estiloTema}\n` +
      `*Cores:* ${formData.cores}\n` +
      `*Tamanho:* ${formData.tamanho}\n` +
      `*Modelagem:* ${formData.modelagem === 'babylook' ? 'Baby Look' : 'Slim'}\n` +
      (formData.observacoes ? `*Observacoes:* ${formData.observacoes}\n` : '') +
      `\n*Dados:*\n` +
      `Nome: ${profile.nome}\n` +
      `WhatsApp: ${profile.whatsapp}\n` +
      (profile.email ? `E-mail: ${profile.email}\n` : '')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    window.location.href = url
  }

  // Profile incomplete guard
  if (!profileComplete) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-rose-pastel/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-accent">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-enchanted mb-2">Complete seu Perfil</h1>
        <p className="text-enchanted-muted text-sm italic mb-6">
          Precisamos do seu nome e WhatsApp para criar seu pedido personalizado.
        </p>
        <Link
          to="/perfil"
          className="inline-block btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline shadow-lg"
        >
          Ir para Perfil
        </Link>
      </div>
    )
  }

  const showInput = [2, 3, 6].includes(step)
  const inputPlaceholder =
    step === 2 ? 'Descreva o estilo ou tema...'
    : step === 3 ? 'Quais cores voce quer...'
    : step === 6 ? 'Detalhes extras (opcional)...'
    : ''

  return (
    <div className="max-w-2xl mx-auto animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <Link
          to="/"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-50 border border-rose-light/40 text-enchanted-muted hover:border-rose-medium/60 transition-all duration-300 no-underline"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display text-xl sm:text-2xl text-enchanted">Personalizar</h1>
          <p className="text-enchanted-muted text-[10px] sm:text-xs italic">Crie sua camisa sob medida</p>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Image picker (step 1) */}
        {showImagePicker && step === 1 && (
          <ChatImagePicker onImageSelected={handleImageSelected} />
        )}

        {/* Summary card (step 7) */}
        {step === 7 && messages.length > 0 && messages[messages.length - 1]?.sender === 'bot' && (
          <ChatSummary formData={formData} profile={profile} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom action area */}
      <div className="flex-shrink-0 pt-3 border-t border-rose-light/20">
        {/* Step 0: Start button */}
        {step === 0 && (
          <button
            onClick={handleStart}
            className="w-full btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg"
          >
            Vamos la!
          </button>
        )}

        {/* Steps 2, 3, 6: Text input */}
        {showInput && (
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 input-enchanted rounded-xl px-4 py-3 text-sm"
            />
            {step === 6 && (
              <button
                type="button"
                onClick={handleSkipObs}
                className="bg-cream-50 border border-rose-light/40 text-enchanted-muted px-3 py-3 rounded-xl text-xs font-heading cursor-pointer transition-all duration-300 hover:border-rose-medium/50"
              >
                Pular
              </button>
            )}
            <button
              type="submit"
              className="bg-rose-pastel hover:bg-rose-light text-rose-deep px-5 py-3 rounded-xl font-heading text-sm cursor-pointer transition-all duration-300 border border-rose-light/50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        )}

        {/* Step 4: Size buttons */}
        {step === 4 && (
          <div className="grid grid-cols-4 gap-2">
            {['P', 'M', 'G', 'GG'].map((tam) => (
              <button
                key={tam}
                onClick={() => handleTamanho(tam)}
                className="py-3 rounded-xl border-2 border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/30 font-heading text-sm cursor-pointer transition-all duration-300"
              >
                {tam}
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Fit buttons */}
        {step === 5 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleModelagem('slim')}
              className="py-3.5 rounded-xl border-2 border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/30 font-heading text-sm cursor-pointer transition-all duration-300"
            >
              Slim
            </button>
            <button
              onClick={() => handleModelagem('babylook')}
              className="py-3.5 rounded-xl border-2 border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/30 font-heading text-sm cursor-pointer transition-all duration-300"
            >
              Baby Look
            </button>
          </div>
        )}

        {/* Step 7: Confirm/Back buttons */}
        {step === 7 && (
          <div className="flex gap-3">
            <button
              onClick={handleVoltar}
              className="flex-1 py-3.5 rounded-full border-2 border-rose-light/50 bg-cream-50 text-enchanted-muted font-heading text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:border-rose-medium"
            >
              Recomecar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={enviando}
              className="flex-[2] btn-enchanted disabled:opacity-50 text-white font-heading text-xs uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.126 1.522 5.864L.054 23.577a.5.5 0 00.608.608l5.713-1.468A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.35-1.554l-.384-.23-3.388.87.887-3.388-.23-.384A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              {enviando ? 'Enviando...' : 'Confirmar pelo WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
