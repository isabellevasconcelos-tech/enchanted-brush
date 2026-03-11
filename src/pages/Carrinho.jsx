import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import FloralDivider from '../components/FloralDivider'

export default function Carrinho() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, getPrecoItem } = useCart()
  const navigate = useNavigate()

  const formatPrice = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

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
        <h1 className="font-display text-2xl text-enchanted mb-2">Seu carrinho está vazio</h1>
        <p className="text-enchanted-muted text-sm italic mb-6">
          Explore nossa coleção e encontre peças únicas!
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

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">Seu Carrinho</h1>
        <p className="text-enchanted-muted text-sm italic">
          {items.length} {items.length === 1 ? 'peça' : 'peças'} selecionada{items.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex justify-end mb-2">
        <button
          onClick={clearCart}
          className="text-enchanted-muted hover:text-rose-deep text-xs font-heading uppercase tracking-widest cursor-pointer bg-transparent border-none flex items-center gap-1.5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Limpar Carrinho
        </button>
      </div>

      <FloralDivider className="mb-6" />

      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const precoUnitario = getPrecoItem(item)
          const subtotal = precoUnitario * item.quantidade
          const mod = item.modelagem || 'slim'
          return (
            <div
              key={`${item.camisa.id}-${item.tamanho}-${mod}`}
              className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 flex gap-4 items-center"
            >
              <img
                src={item.camisa.imagem_url || 'https://placehold.co/100x100/2E2214/C8962E?text=Arte'}
                alt={item.camisa.nome}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base text-enchanted truncate">{item.camisa.nome}</h3>
                <p className="text-enchanted-muted text-xs">
                  {mod === 'babylook' ? 'Baby Look' : 'Slim'} &middot; Tam: {item.tamanho}
                </p>
                <p className="text-rose-accent font-heading text-sm mt-1">
                  {formatPrice(precoUnitario)} cada
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.camisa.id, item.tamanho, mod, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                  className="w-8 h-8 rounded-full bg-rose-pastel/50 text-rose-deep flex items-center justify-center cursor-pointer border border-rose-light/50 disabled:opacity-30 transition-colors hover:bg-rose-light"
                >
                  -
                </button>
                <span className="w-8 text-center font-heading text-sm text-enchanted">
                  {item.quantidade}
                </span>
                <button
                  onClick={() => updateQuantity(item.camisa.id, item.tamanho, mod, item.quantidade + 1)}
                  className="w-8 h-8 rounded-full bg-rose-pastel/50 text-rose-deep flex items-center justify-center cursor-pointer border border-rose-light/50 transition-colors hover:bg-rose-light"
                >
                  +
                </button>
              </div>

              <div className="text-right flex-shrink-0 w-24">
                <p className="font-heading text-base text-rose-accent">{formatPrice(subtotal)}</p>
                <button
                  onClick={() => removeFromCart(item.camisa.id, item.tamanho, mod)}
                  className="text-enchanted-muted hover:text-rose-deep mt-1 cursor-pointer bg-transparent border-none transition-colors"
                  title="Remover do carrinho"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" />
                    <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-5 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-heading text-sm text-enchanted uppercase tracking-widest">Total</span>
          <span className="font-heading text-2xl text-rose-accent font-semibold">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/loja"
          className="flex-1 text-center bg-cream-50 border border-rose-light/50 text-enchanted-muted font-heading text-sm uppercase tracking-widest py-3.5 rounded-full no-underline hover:bg-rose-pastel/30 transition-colors"
        >
          Continuar Comprando
        </Link>
        <button
          onClick={() => navigate('/checkout')}
          className="flex-1 btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Finalizar Compra
        </button>
      </div>

      {/* WhatsApp - Dúvidas */}
      <div className="mt-8 text-center">
        <p className="text-enchanted-muted text-sm italic mb-3">
          Tem alguma dúvida antes de finalizar? Fale diretamente conosco!
        </p>
        <a
          href="https://wa.me/5551993777539?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20meu%20pedido%20no%20Enchanted%20Brush%20Atelier!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-heading text-sm uppercase tracking-widest px-6 py-3 rounded-full no-underline shadow-md hover:shadow-lg transition-all duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Conversar no WhatsApp
        </a>
      </div>
    </div>
  )
}
