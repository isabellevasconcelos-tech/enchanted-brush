import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useStars } from '../context/StarsContext'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabase'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

const FRETE_RS = 20
const CUPOM_ESTRELAS = 'STARCOLLECTOR5'
const DESCONTO_ESTRELAS = 0.05

export default function Encomenda() {
  const { items, clearCart, totalPrice, getPrecoItem } = useCart()
  const { rewardClaimed } = useStars()
  const { profile } = useProfile()

  const [pagamento, setPagamento] = useState('')
  const [parcelas, setParcelas] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  // Cupom — auto-apply if all stars were collected
  const [cupom, setCupom] = useState(rewardClaimed ? CUPOM_ESTRELAS : '')
  const [cupomAplicado, setCupomAplicado] = useState(rewardClaimed)
  const [cupomErro, setCupomErro] = useState('')

  // Primeira compra = frete grátis
  const primeiraCompra = !localStorage.getItem('enchanted-first-purchase-done')
  const freteGratis = primeiraCompra
  const freteValor = freteGratis ? 0 : FRETE_RS
  const descontoPct = cupomAplicado ? DESCONTO_ESTRELAS : 0
  const descontoValor = totalPrice * descontoPct
  const totalComDescontoEFrete = totalPrice - descontoValor + freteValor
  const podeParcerar = pagamento === 'credito' && totalComDescontoEFrete > 180

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-rose-pastel/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-accent">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-enchanted mb-2">Nenhum item no carrinho</h1>
        <p className="text-enchanted-muted text-sm italic mb-6">
          Adicione peças ao carrinho antes de finalizar.
        </p>
        <Link
          to="/loja"
          className="inline-block btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline shadow-lg"
        >
          Ver Coleção
        </Link>
      </div>
    )
  }

  function handleAplicarCupom() {
    const codigo = cupom.trim().toUpperCase()
    if (codigo === CUPOM_ESTRELAS) {
      setCupomAplicado(true)
      setCupomErro('')
    } else {
      setCupomAplicado(false)
      setCupomErro('Cupom inválido.')
    }
  }

  function handleRemoverCupom() {
    setCupom('')
    setCupomAplicado(false)
    setCupomErro('')
  }

  function buildWhatsAppMessage() {
    const itensTexto = items
      .map((item) => {
        const mod = item.modelagem === 'babylook' ? 'Baby Look' : 'Slim'
        const preco = getPrecoItem(item)
        return `- ${item.camisa.nome} | ${mod} | Tam: ${item.tamanho} | Qtd: ${item.quantidade} | ${formatPrice(preco * item.quantidade)}`
      })
      .join('\n')

    const pagamentoTexto =
      pagamento === 'credito'
        ? `Cartão de Crédito${parcelas > 1 ? ` (${parcelas}x de ${formatPrice(totalComDescontoEFrete / parcelas)})` : ''}`
        : pagamento === 'debito'
          ? 'Cartão de Débito'
          : 'PIX'

    const endereco = profile.rua
      ? `${profile.rua}, ${profile.numero}${profile.complemento ? ` - ${profile.complemento}` : ''}, ${profile.bairro}, ${profile.cidade}, CEP: ${profile.cep}`
      : 'Não informado'

    let resumo =
      `Olá! Gostaria de finalizar meu pedido:\n\n` +
      `*Itens:*\n${itensTexto}\n\n` +
      `*Subtotal:* ${formatPrice(totalPrice)}\n`

    if (cupomAplicado) {
      resumo += `*Desconto (${CUPOM_ESTRELAS} - 5%):* -${formatPrice(descontoValor)}\n`
    }

    if (freteGratis) {
      resumo += `*Frete:* GRÁTIS (primeira compra)\n`
    } else {
      resumo += `*Frete (RS):* ${formatPrice(FRETE_RS)}\n`
    }

    resumo +=
      `*Total:* ${formatPrice(totalComDescontoEFrete)}\n\n` +
      `*Pagamento:* ${pagamentoTexto}\n\n` +
      `*Dados:*\n` +
      `Nome: ${profile.nome}\n` +
      `E-mail: ${profile.email || 'Não informado'}\n` +
      `WhatsApp: ${profile.whatsapp}\n\n` +
      `*Endereço:*\n${endereco}`

    return encodeURIComponent(resumo)
  }

  async function handleFinalizar() {
    if (!pagamento) {
      setErro('Selecione uma forma de pagamento.')
      return
    }

    setEnviando(true)
    setErro(null)

    const obsExtra = []
    if (cupomAplicado) obsExtra.push(`Cupom: ${CUPOM_ESTRELAS} (-5%)`)
    if (freteGratis) obsExtra.push('Frete grátis (primeira compra)')
    obsExtra.push(`Pagamento: ${pagamento}${parcelas > 1 ? ` ${parcelas}x` : ''}`)
    if (profile.rua) {
      obsExtra.push(`Endereço: ${profile.rua}, ${profile.numero}, ${profile.bairro}, ${profile.cidade}, CEP: ${profile.cep}`)
    }

    const pedidos = items.map((item) => ({
      camisa_id: item.camisa.id,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
      nome_cliente: profile.nome,
      email_cliente: profile.email,
      telefone_cliente: profile.whatsapp,
      observacoes: `Modelagem: ${item.modelagem === 'babylook' ? 'Baby Look' : 'Slim'} | ${obsExtra.join(' | ')}`,
    }))

    const { error } = await supabase.from('pedidos').insert(pedidos)

    if (error) {
      console.error(error)
      setErro('Erro ao salvar pedido. Tente novamente.')
      setEnviando(false)
      return
    }

    localStorage.setItem('enchanted-first-purchase-done', 'true')

    const msg = buildWhatsAppMessage()
    const url = `https://wa.me/5551993777539?text=${msg}`

    clearCart()
    window.location.href = url
  }

  const formatPrice = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">
          Finalizar Pedido
        </h1>
        <p className="text-enchanted-muted text-sm italic">
          Revise seu pedido e escolha a forma de pagamento
        </p>
      </div>

      <FloralDivider className="mb-6" />

      {/* Free shipping banner */}
      {freteGratis && (
        <div className="bg-gold-pastel/50 border border-gold-light rounded-2xl p-4 mb-6 text-center animate-fade-in">
          <p className="font-heading text-sm text-gold-deep uppercase tracking-widest mb-1">
            Frete Grátis!
          </p>
          <p className="text-enchanted-muted text-xs italic">
            Sua primeira compra tem frete grátis para todo o Rio Grande do Sul.
          </p>
        </div>
      )}

      {/* Profile summary */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-sm text-enchanted uppercase tracking-widest">
            Seus Dados
          </h2>
          <Link
            to="/perfil"
            className="text-rose-accent hover:text-rose-deep text-xs font-heading tracking-wide no-underline flex items-center gap-1 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Editar
          </Link>
        </div>
        <div className="space-y-1 text-sm text-enchanted-muted">
          <p><span className="text-enchanted font-heading">Nome:</span> {profile.nome}</p>
          <p><span className="text-enchanted font-heading">WhatsApp:</span> {profile.whatsapp}</p>
          {profile.email && <p><span className="text-enchanted font-heading">E-mail:</span> {profile.email}</p>}
          {profile.rua && (
            <p>
              <span className="text-enchanted font-heading">Endereço:</span>{' '}
              {profile.rua}, {profile.numero}{profile.complemento ? ` - ${profile.complemento}` : ''}, {profile.bairro}, {profile.cidade}
              {profile.cep ? ` - CEP: ${profile.cep}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-5 mb-6">
        <h2 className="font-heading text-sm text-enchanted uppercase tracking-widest mb-4">
          Resumo do Pedido
        </h2>
        <div className="space-y-3">
          {items.map((item) => {
            const preco = getPrecoItem(item)
            const mod = item.modelagem || 'slim'
            return (
              <div
                key={`${item.camisa.id}-${item.tamanho}-${mod}`}
                className="flex items-center gap-3"
              >
                <img
                  src={item.camisa.imagem_url || 'https://placehold.co/60x60/2E2214/C8962E?text=Arte'}
                  alt={item.camisa.nome}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm text-enchanted truncate">{item.camisa.nome}</p>
                  <p className="text-enchanted-muted text-xs">
                    {mod === 'babylook' ? 'Baby Look' : 'Slim'} &middot; Tam: {item.tamanho} &middot; Qtd: {item.quantidade}
                  </p>
                </div>
                <span className="font-heading text-sm text-rose-accent flex-shrink-0">
                  {formatPrice(preco * item.quantidade)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="border-t border-rose-light/30 mt-4 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-enchanted-muted">Subtotal</span>
            <span className="text-enchanted font-heading">{formatPrice(totalPrice)}</span>
          </div>

          {cupomAplicado && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Desconto (5%)</span>
              <span className="text-green-600 font-heading">-{formatPrice(descontoValor)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-enchanted-muted">Frete (RS)</span>
            {freteGratis ? (
              <span className="text-green-600 font-heading">Grátis</span>
            ) : (
              <span className="text-enchanted font-heading">{formatPrice(FRETE_RS)}</span>
            )}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-rose-light/20">
            <span className="font-heading text-sm text-enchanted uppercase tracking-widest">Total</span>
            <span className="font-heading text-xl text-rose-accent font-semibold">
              {formatPrice(totalComDescontoEFrete)}
            </span>
          </div>
        </div>

        <div className="relative">
          <span className="absolute -right-2 -top-2"><HiddenStar id="create-form" /></span>
        </div>
      </div>

      {/* Discount Coupon */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-5 mb-6">
        <h2 className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
          Cupom de Desconto
        </h2>

        {rewardClaimed && cupomAplicado && (
          <div className="bg-gold-pastel/50 border border-gold-light rounded-xl p-3 mb-3 text-center">
            <p className="font-heading text-sm text-gold-deep mb-0.5">
              Parabéns, explorador(a)!
            </p>
            <p className="text-enchanted-muted text-xs italic">
              Você encontrou todas as 7 estrelas escondidas e seu desconto de 5% já foi aplicado automaticamente!
            </p>
          </div>
        )}

        {cupomAplicado ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 font-heading flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600 flex-shrink-0">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {CUPOM_ESTRELAS} aplicado (-5%)
            </div>
            <button
              onClick={handleRemoverCupom}
              className="text-enchanted-muted hover:text-rose-deep text-xs cursor-pointer bg-transparent border-none underline flex-shrink-0"
            >
              Remover
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={cupom}
                onChange={(e) => {
                  setCupom(e.target.value)
                  setCupomErro('')
                }}
                className="flex-1 input-enchanted rounded-xl px-4 py-2.5 text-sm uppercase"
                placeholder="Digite seu cupom"
              />
              <button
                type="button"
                onClick={handleAplicarCupom}
                className="bg-rose-pastel hover:bg-rose-light text-rose-deep px-5 py-2.5 rounded-xl text-sm font-heading tracking-wide cursor-pointer transition-all duration-300 border border-rose-light/50 flex-shrink-0"
              >
                Aplicar
              </button>
            </div>
            {cupomErro && (
              <p className="text-rose-deep text-xs mt-2">{cupomErro}</p>
            )}
          </div>
        )}
      </div>

      {erro && (
        <p className="bg-rose-pastel/50 text-rose-deep p-3 rounded-xl mb-4 text-sm text-center">
          {erro}
        </p>
      )}

      {/* Payment Method */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-6 mb-6">
        <h2 className="font-heading text-sm text-enchanted uppercase tracking-widest mb-4">
          Forma de Pagamento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { value: 'pix', label: 'PIX', icon: '💠' },
            { value: 'credito', label: 'Crédito', icon: '💳' },
            { value: 'debito', label: 'Débito', icon: '💳' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setPagamento(opt.value)
                setParcelas(1)
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 ${
                pagamento === opt.value
                  ? 'border-rose-accent bg-rose-pastel/30 shadow-md'
                  : 'border-rose-light/50 bg-cream-50 hover:border-rose-medium'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="font-heading text-sm text-enchanted tracking-wide">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Installments */}
        {podeParcerar && (
          <div className="animate-fade-in">
            <label className="block text-sm font-heading text-enchanted uppercase tracking-widest mb-2">
              Parcelas
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setParcelas(n)}
                  className={`flex-1 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 font-heading text-sm ${
                    parcelas === n
                      ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent shadow-md'
                      : 'border-rose-light/50 bg-cream-50 text-enchanted-muted hover:border-rose-medium'
                  }`}
                >
                  {n}x {formatPrice(totalComDescontoEFrete / n)}
                </button>
              ))}
            </div>
          </div>
        )}

        {pagamento === 'credito' && !podeParcerar && totalComDescontoEFrete <= 180 && (
          <p className="text-enchanted-muted text-xs italic mt-2">
            Parcelamento disponível para compras acima de R$ 180,00.
          </p>
        )}
      </div>

      {/* Finalize Button */}
      <button
        onClick={handleFinalizar}
        disabled={enviando}
        className="w-full btn-enchanted disabled:opacity-50 text-white font-heading text-sm uppercase tracking-widest py-4 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.126 1.522 5.864L.054 23.577a.5.5 0 00.608.608l5.713-1.468A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.35-1.554l-.384-.23-3.388.87.887-3.388-.23-.384A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        {enviando ? 'Processando...' : 'Finalizar pelo WhatsApp'}
      </button>

      <p className="text-enchanted-muted text-xs text-center mt-3 italic">
        Você será redirecionado para o WhatsApp para confirmar seu pedido diretamente conosco.
      </p>
    </div>
  )
}
