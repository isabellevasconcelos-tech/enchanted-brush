import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { processMessage } from '../lib/aurora'

const WHATSAPP_NUMBER = '5551993777539'

const PAGE_LABELS = {
  '/shop': 'Loja',
  '/loja': 'Loja',
  '/personalizar': 'Personalizar',
  '/criar-camisa': 'Criar Camisa',
  '/carrinho': 'Carrinho',
  '/checkout': 'Finalizar Compra',
  '/perfil': 'Perfil',
  '/inspiracoes': 'Inspiracoes',
  '/my-story': 'Nossa Historia',
  '/hidden-stars': 'Estrelas Escondidas',
  '/limited': 'Pecas Limitadas',
  '/': 'Inicio',
}

export default function AuroraChatPanel({ onClose }) {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { items, addToCart, totalPrice, totalItems } = useCart()
  const [unrolled, setUnrolled] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: profile.nome
        ? `Saudacoes, nobre ${profile.nome}! Eu sou Aurora, guardia magica deste atelier encantado. Em que posso te ajudar nesta jornada, meu(minha) caro(a)?`
        : 'Saudacoes, nobre viajante! Eu sou Aurora, guardia magica deste atelier encantado. Em que posso te ajudar nesta bela jornada?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setUnrolled(true))
    })
  }, [])

  function handleNavigate(path) {
    navigate(path)
    onClose()
  }

  // Execute an action and return { text, link? }
  async function executeAction(action, userText) {
    if (!action) return { text: null }

    switch (action.type) {
      case 'navigate': {
        return {
          text: null,
          link: { path: action.path, label: PAGE_LABELS[action.path] || 'Ir' },
        }
      }

      case 'search_products': {
        const { data } = await supabase
          .from('camisas')
          .select('*')
          .eq('disponivel', true)
          .order('criado_em', { ascending: false })
          .limit(10)

        if (!data || data.length === 0) {
          return { text: 'No momento, nosso atelier esta preparando novas pecas encantadas. Volte em breve, nobre viajante!' }
        }

        const list = data.map((p) => `  - ${p.nome} — R$${Number(p.preco).toFixed(2)}`).join('\n')
        return {
          text: `Eis as pecas magicas disponiveis em nosso atelier:\n\n${list}`,
          link: { path: '/shop', label: 'Ver na Loja' },
        }
      }

      case 'add_to_cart': {
        const { data } = await supabase
          .from('camisas')
          .select('*')
          .eq('disponivel', true)

        if (!data || data.length === 0) {
          return { text: 'Perdoe-me, nobre viajante, mas nao encontrei pecas disponiveis no momento.' }
        }

        const normalized = userText.toLowerCase()
        const found = data.find((p) => {
          const words = p.nome.toLowerCase().split(/\s+/)
          return words.some((w) => w.length > 3 && normalized.includes(w))
        })

        if (!found) {
          const list = data.map((p) => `  - ${p.nome}`).join('\n')
          return {
            text: `Nao consegui identificar qual peca deseja, nobre viajante. Eis as disponiveis:\n\n${list}\n\nDiga o nome da peca e o tamanho (P, M, G ou GG)!`,
          }
        }

        const sizeMatch = userText.match(/\b(P|M|G|GG)\b/i)
        if (!sizeMatch) {
          return { text: `Encontrei a peca "${found.nome}" (R$${Number(found.preco).toFixed(2)})! Mas preciso saber: qual tamanho deseja? P, M, G ou GG?` }
        }

        const size = sizeMatch[1].toUpperCase()
        const fitMatch = userText.toLowerCase().includes('baby') ? 'babylook' : 'slim'
        addToCart(found, size, 1, fitMatch)
        return {
          text: `Maravilha! Adicionei "${found.nome}" tamanho ${size} ao seu bau de tesouros!`,
          link: { path: '/carrinho', label: 'Ver Carrinho' },
        }
      }

      case 'get_cart': {
        if (items.length === 0) {
          return {
            text: 'Seu bau de tesouros esta vazio, nobre viajante! Que tal explorar nossa loja?',
            link: { path: '/shop', label: 'Ir para Loja' },
          }
        }
        const list = items
          .map((item) => `  - ${item.camisa.nome} (${item.tamanho}, ${item.modelagem === 'babylook' ? 'Baby Look' : 'Slim'}) x${item.quantidade}`)
          .join('\n')
        return {
          text: `Em seu bau de tesouros encontram-se:\n\n${list}\n\nTotal: R$${totalPrice.toFixed(2)} com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}.`,
          link: { path: '/carrinho', label: 'Ver Carrinho' },
        }
      }

      case 'open_whatsapp': {
        const msg = profile.nome
          ? `Ola! Sou ${profile.nome} e gostaria de mais informacoes.`
          : 'Ola! Gostaria de mais informacoes.'
        return {
          text: null,
          whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        }
      }

      default:
        return { text: null }
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      await new Promise((r) => setTimeout(r, 600))

      const { response, action } = processMessage(text)
      const actionResult = await executeAction(action, text)

      const finalText = actionResult.text || response
      const msg = {
        role: 'assistant',
        content: finalText,
        link: actionResult.link || null,
        whatsapp: actionResult.whatsapp || null,
      }
      setMessages((prev) => [...prev, msg])
    } catch (err) {
      console.error('Aurora error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oh, perdoe-me, nobre viajante... algo inesperado aconteceu. Tente novamente ou fale conosco pelo WhatsApp (51) 99377-7539!',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-20 left-3 sm:left-6 z-[9998] w-[calc(100vw-1.5rem)] sm:w-[380px]">
      <div className="papyrus-scroll" style={{ maxWidth: '100%' }}>
        <div
          className="papyrus-roll papyrus-roll-top"
          style={{
            transform: unrolled ? 'translateY(0)' : 'translateY(200px)',
            transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        <div
          className="papyrus-body flex flex-col overflow-hidden"
          style={{
            padding: 0,
            maxHeight: unrolled ? '480px' : '0px',
            opacity: unrolled ? 1 : 0,
            transition: 'max-height 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.5s ease-in 0.5s',
          }}
        >
          {/* Header */}
          <div className="relative text-center px-4 pt-5 pb-3 border-b" style={{ borderColor: 'rgba(200,168,78,0.15)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mx-auto mb-2 opacity-70">
              <path d="M14 2C14 2 17 7 17 10C17 13 14 16 14 16C14 16 11 13 11 10C11 7 14 2 14 2Z" fill="#8B6914" />
              <path d="M14 16C14 16 19 13 22 13C25 13 26 16 26 16C26 16 23 19 20 19C17 19 14 16 14 16Z" fill="#6B4E1B" />
              <path d="M14 16C14 16 9 13 6 13C3 13 2 16 2 16C2 16 5 19 8 19C11 19 14 16 14 16Z" fill="#8B6914" />
              <path d="M14 16C14 16 17 21 17 24C17 26 14 28 14 28C14 28 11 26 11 24C11 21 14 16 14 16Z" fill="#6B4E1B" />
              <circle cx="14" cy="16" r="3" fill="#C8A84E" />
            </svg>

            <h3 className="font-display text-lg leading-tight" style={{ color: '#C8A84E', textShadow: '0 0 20px rgba(200,168,78,0.2)' }}>
              Aurora
            </h3>
            <p className="font-heading text-[10px] uppercase tracking-[0.25em] mt-0.5" style={{ color: 'rgba(200,168,78,0.5)' }}>
              Guardia do Enchanted Brush
            </p>

            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-10" style={{ background: 'rgba(200,168,78,0.3)' }} />
              <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: 'rgba(200,168,78,0.4)' }}>
                <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
              </svg>
              <div className="h-px w-10" style={{ background: 'rgba(200,168,78,0.3)' }} />
            </div>

            {/* Close X button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(200,168,78,0.1)', border: '1px solid rgba(200,168,78,0.2)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.6 }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '300px', minHeight: '180px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                  style={
                    msg.role === 'assistant'
                      ? {
                          background: 'rgba(200,168,78,0.08)',
                          border: '1px solid rgba(200,168,78,0.15)',
                          borderRadius: '4px 14px 14px 14px',
                          color: 'rgba(240,230,214,0.8)',
                          fontFamily: '"Lora", serif',
                        }
                      : {
                          background: 'rgba(139,26,43,0.15)',
                          border: '1px solid rgba(139,26,43,0.25)',
                          borderRadius: '14px 4px 14px 14px',
                          color: 'rgba(240,230,214,0.85)',
                          fontFamily: '"Lora", serif',
                        }
                  }
                >
                  {msg.content}
                </div>

                {/* Navigation shortcut button */}
                {msg.link && (
                  <button
                    onClick={() => handleNavigate(msg.link.path)}
                    className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,105,20,0.3), rgba(200,168,78,0.2))',
                      border: '1px solid rgba(200,168,78,0.35)',
                      color: '#C8A84E',
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    {msg.link.label}
                  </button>
                )}

                {/* WhatsApp shortcut button */}
                {msg.whatsapp && (
                  <a
                    href={msg.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg no-underline cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.08))',
                      border: '1px solid rgba(37,211,102,0.3)',
                      color: '#25D366',
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    Abrir WhatsApp
                  </a>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3.5 py-2.5 text-sm"
                  style={{
                    background: 'rgba(200,168,78,0.08)',
                    border: '1px solid rgba(200,168,78,0.15)',
                    borderRadius: '4px 14px 14px 14px',
                    color: 'rgba(200,168,78,0.5)',
                    fontFamily: '"Lora", serif',
                  }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="flex gap-2 px-4 py-3 border-t"
            style={{ borderColor: 'rgba(200,168,78,0.15)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva ao pergaminho..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(200,168,78,0.06)',
                border: '1px solid rgba(200,168,78,0.2)',
                color: 'rgba(240,230,214,0.85)',
                fontFamily: '"Lora", serif',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-30 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #C8A84E)',
                border: '1px solid rgba(200,168,78,0.4)',
                boxShadow: '0 2px 8px rgba(139,105,20,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,230,214,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </button>
          </form>
        </div>

        <div
          className="papyrus-roll papyrus-roll-bottom"
          style={{
            transform: unrolled ? 'translateY(0)' : 'translateY(-200px)',
            transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </div>
    </div>
  )
}
