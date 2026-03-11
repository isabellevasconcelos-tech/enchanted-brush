import { useLocation, Link, Navigate } from 'react-router-dom'
import FloralDivider from '../components/FloralDivider'

export default function Confirmacao() {
  const { state } = useLocation()

  if (!state?.pedido && !state?.resumoCarrinho) {
    return <Navigate to="/" replace />
  }

  const { pedido, camisa, resumoCarrinho, total, nomeCliente, emailCliente } = state

  const formatPrice = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="max-w-lg mx-auto text-center animate-fade-in">
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-8 shadow-[0_4px_20px_rgba(200,150,46,0.1)]">
        {/* Sparkle icon */}
        <div className="w-16 h-16 bg-gold-pastel rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 8 8" className="text-gold-accent animate-sparkle">
            <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
          </svg>
        </div>

        <h1 className="font-display text-2xl text-enchanted mb-2">
          Pedido Enviado!
        </h1>
        <p className="text-enchanted-muted text-sm italic mb-6">
          Entraremos em contato em breve para confirmar seu pedido.
        </p>

        <div className="bg-cream-200/50 rounded-xl p-5 text-left space-y-2.5 mb-6 border border-rose-light/20">
          <h3 className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
            Resumo do pedido
          </h3>

          {/* Cart summary (multiple items) */}
          {resumoCarrinho ? (
            <>
              {resumoCarrinho.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-rose-light/20 last:border-0">
                  <div>
                    <span className="text-enchanted font-heading">{item.nome}</span>
                    <span className="text-enchanted-muted ml-2">
                      {item.tamanho} x{item.quantidade}
                    </span>
                  </div>
                  <span className="text-rose-accent font-heading">
                    {formatPrice(item.preco * item.quantidade)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-rose-medium/30">
                <span className="font-heading text-sm text-enchanted uppercase tracking-widest">Total</span>
                <span className="font-heading text-lg text-rose-accent font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-sm text-enchanted-muted">
                  <span className="font-heading text-enchanted">Nome:</span> {nomeCliente}
                </p>
                <p className="text-sm text-enchanted-muted">
                  <span className="font-heading text-enchanted">E-mail:</span> {emailCliente}
                </p>
              </div>
            </>
          ) : (
            /* Single item fallback (legacy) */
            <>
              {camisa && (
                <p className="text-sm text-enchanted-muted">
                  <span className="font-heading text-enchanted">Camisa:</span> {camisa.nome}
                </p>
              )}
              <p className="text-sm text-enchanted-muted">
                <span className="font-heading text-enchanted">Tamanho:</span> {pedido.tamanho}
              </p>
              <p className="text-sm text-enchanted-muted">
                <span className="font-heading text-enchanted">Quantidade:</span> {pedido.quantidade}
              </p>
              <p className="text-sm text-enchanted-muted">
                <span className="font-heading text-enchanted">Nome:</span> {pedido.nome_cliente}
              </p>
              <p className="text-sm text-enchanted-muted">
                <span className="font-heading text-enchanted">E-mail:</span> {pedido.email_cliente}
              </p>
              {pedido.telefone_cliente && (
                <p className="text-sm text-enchanted-muted">
                  <span className="font-heading text-enchanted">WhatsApp:</span> {pedido.telefone_cliente}
                </p>
              )}
              {pedido.observacoes && (
                <p className="text-sm text-enchanted-muted">
                  <span className="font-heading text-enchanted">Observações:</span> {pedido.observacoes}
                </p>
              )}
            </>
          )}
        </div>

        <FloralDivider />

        <Link
          to="/loja"
          className="inline-block mt-4 btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline shadow-lg transition-all duration-300"
        >
          Voltar à Coleção
        </Link>
      </div>
    </div>
  )
}
