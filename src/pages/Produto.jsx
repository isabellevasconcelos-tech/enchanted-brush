import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

export default function Produto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [camisa, setCamisa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [modelagem, setModelagem] = useState('slim')
  const [corCamisa, setCorCamisa] = useState('Branco')
  const [adicionado, setAdicionado] = useState(false)
  const [verMais, setVerMais] = useState(false)
  const [zoomAberto, setZoomAberto] = useState(false)

  useEffect(() => {
    async function fetchCamisa() {
      const { data, error } = await supabase
        .from('camisas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setErro('Peça não encontrada.')
        console.error(error)
      } else {
        setCamisa(data)
        setTamanhoSelecionado(data.tamanhos?.[0] || '')
      }
      setLoading(false)
    }

    fetchCamisa()
  }, [id])

  const precoFinal = modelagem === 'babylook' ? Number(camisa?.preco || 0) + 20 : Number(camisa?.preco || 0)

  function handleAddToCart() {
    addToCart(camisa, tamanhoSelecionado, quantidade, modelagem, corCamisa)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-light border-t-rose-accent" />
        </div>
        <p className="text-enchanted-muted text-sm italic">Carregando...</p>
      </div>
    )
  }

  if (!camisa) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-rose-deep mb-4 italic">{erro || 'Peça não encontrada.'}</p>
        <Link
          to="/loja"
          className="text-rose-accent hover:text-rose-deep no-underline font-heading text-sm uppercase tracking-widest"
        >
          Voltar à Coleção
        </Link>
      </div>
    )
  }

  const precoFormatado = precoFinal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        to="/loja"
        className="inline-flex items-center gap-1 text-rose-accent hover:text-rose-deep no-underline text-sm font-heading uppercase tracking-widest mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Voltar à Coleção
      </Link>

      <div className="bg-cream-50 rounded-2xl overflow-hidden border border-rose-light/30 shadow-[0_4px_20px_rgba(200,150,46,0.1)]">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 relative">
            <img
              src={camisa.imagem_url || 'https://placehold.co/600x600/2E2214/C8962E?text=Arte'}
              alt={camisa.nome}
              className="w-full h-80 md:h-full object-cover cursor-zoom-in"
              onClick={() => setZoomAberto(true)}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 8 8"
              className="absolute top-4 right-4 text-gold-accent animate-sparkle"
            >
              <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
            </svg>
            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 bg-black/40 text-white rounded-full p-1.5 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="absolute bottom-3 left-3"><HiddenStar id="product-detail" /></span>
          </div>

          {/* Zoom Modal */}
          {zoomAberto && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in"
              onClick={() => setZoomAberto(false)}
            >
              <button
                onClick={() => setZoomAberto(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img
                src={camisa.imagem_url || 'https://placehold.co/600x600/2E2214/C8962E?text=Arte'}
                alt={camisa.nome}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Product Details */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <h1 className="font-display text-2xl sm:text-3xl text-enchanted mb-3">
              {camisa.nome}
            </h1>
            <p className="text-enchanted-muted leading-relaxed mb-4">
              {camisa.descricao}
            </p>

            <button
              onClick={() => setVerMais(!verMais)}
              className="text-rose-accent hover:text-rose-deep text-sm font-heading tracking-wide cursor-pointer bg-transparent border-none mb-6 flex items-center gap-1.5 transition-colors"
            >
              {verMais ? 'Ver menos' : 'Ver mais'}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-300 ${verMais ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {verMais && (
              <div className="mb-6 bg-cream-200/40 rounded-xl p-5 border border-rose-light/20 animate-fade-in space-y-4">
                <h3 className="font-heading text-sm text-enchanted uppercase tracking-widest">
                  Camiseta Lisa Básica Slim 100% Algodão
                </h3>
                <p className="text-enchanted-muted text-sm italic">
                  Também disponível com gola em formato V.
                </p>

                <p className="text-enchanted-muted text-sm leading-relaxed">
                  Versátil, confortável e com caimento impecável, a camiseta Enchanted Brush é aquele essencial que nunca sai de moda. Cada peça recebe uma arte única e inovadora, pintada com cuidado para transformar uma camiseta básica em algo especial.
                </p>

                <p className="text-enchanted-muted text-sm leading-relaxed">
                  Confeccionada em 100% algodão de alta qualidade, oferece toque macio e ótima respirabilidade, perfeita para o dia a dia. Sua modelagem proporciona um ajuste moderno ao corpo sem abrir mão do conforto.
                </p>

                <p className="text-enchanted-muted text-sm leading-relaxed">
                  Disponível nas cores bege, branco e off-white, combina facilmente com diferentes estilos — desde looks casuais até produções mais elaboradas. Um item indispensável para quem valoriza simplicidade, arte e autenticidade.
                </p>

                <div>
                  <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                    Destaques
                  </p>
                  <ul className="space-y-2 text-enchanted-muted text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-accent mt-0.5">•</span>
                      Tecido 100% algodão de alta qualidade
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-accent mt-0.5">•</span>
                      Modelagem slim ou babylook: ajuste moderno e elegante
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-accent mt-0.5">•</span>
                      Opção de gola tradicional ou gola V
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-accent mt-0.5">•</span>
                      Ideal para uso diário ou composição de camadas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-accent mt-0.5">•</span>
                      Arte artesanal exclusiva
                    </li>
                  </ul>
                </div>

                <p className="text-enchanted text-sm font-heading italic text-center pt-2">
                  Estilo, conforto e personalidade em uma peça só. ✨👕
                </p>
              </div>
            )}

            <p className="font-heading text-3xl text-rose-accent font-semibold mb-6">
              {precoFormatado}
              {modelagem === 'babylook' && (
                <span className="text-enchanted-muted text-xs font-body ml-2">(+R$20 babylook)</span>
              )}
            </p>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                Cor da Camisa
              </p>
              <div className="flex gap-3">
                {[
                  { name: 'Branco', hex: '#FFFFFF' },
                  { name: 'Bege', hex: '#F5E6C8' },
                  { name: 'Off-White', hex: '#FAF0E6' },
                ].map((cor) => (
                  <button
                    key={cor.name}
                    onClick={() => setCorCamisa(cor.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm cursor-pointer transition-all duration-300 border-2 ${
                      corCamisa === cor.name
                        ? 'border-rose-accent shadow-md'
                        : 'border-rose-light/50 hover:border-rose-medium'
                    }`}
                    style={{ backgroundColor: cor.hex }}
                  >
                    <span className={corCamisa === cor.name ? 'text-rose-accent font-semibold' : 'text-enchanted-muted'}>
                      {cor.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="mb-6">
              <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                Modelagem
              </p>
              <div className="flex gap-3">
                {[
                  { value: 'slim', label: 'Slim' },
                  { value: 'babylook', label: 'Baby Look (+R$20)' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setModelagem(opt.value)}
                    className={`flex-1 py-3 rounded-xl font-heading text-sm cursor-pointer transition-all duration-300 border-2 ${
                      modelagem === opt.value
                        ? 'bg-rose-accent text-white border-rose-accent shadow-md'
                        : 'bg-cream-50 text-enchanted-muted border-rose-light/50 hover:border-rose-medium'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                Tamanho
              </p>
              <div className="flex flex-wrap gap-2">
                {camisa.tamanhos?.map((tam) => (
                  <button
                    key={tam}
                    onClick={() => setTamanhoSelecionado(tam)}
                    className={`w-12 h-12 rounded-full font-heading text-sm cursor-pointer transition-all duration-300 border-2 ${
                      tamanhoSelecionado === tam
                        ? 'bg-rose-accent text-white border-rose-accent shadow-md'
                        : 'bg-cream-50 text-enchanted-muted border-rose-light/50 hover:border-rose-medium'
                    }`}
                  >
                    {tam}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-heading text-sm text-enchanted uppercase tracking-widest mb-3">
                Quantidade
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  disabled={quantidade <= 1}
                  className="w-10 h-10 rounded-full bg-rose-pastel/50 text-rose-deep flex items-center justify-center cursor-pointer border border-rose-light/50 disabled:opacity-30 transition-colors hover:bg-rose-light"
                >
                  -
                </button>
                <span className="w-8 text-center font-heading text-lg text-enchanted">{quantidade}</span>
                <button
                  onClick={() => setQuantidade((q) => q + 1)}
                  className="w-10 h-10 rounded-full bg-rose-pastel/50 text-rose-deep flex items-center justify-center cursor-pointer border border-rose-light/50 transition-colors hover:bg-rose-light"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-cream-50 border-2 border-rose-accent text-rose-accent font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-md hover:bg-rose-pastel/30 transition-all duration-300"
              >
                {adicionado ? 'Adicionado!' : 'Adicionar ao Carrinho'}
              </button>
              <button
                onClick={() => {
                  addToCart(camisa, tamanhoSelecionado, quantidade, modelagem, corCamisa)
                  navigate('/checkout')
                }}
                className="flex-1 btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Comprar Agora
              </button>
            </div>

            {adicionado && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2 animate-fade-in">
                <Link
                  to="/loja"
                  className="flex-1 text-center bg-cream-50 border border-rose-light/50 text-enchanted-muted font-heading text-xs uppercase tracking-widest py-2.5 rounded-full no-underline hover:bg-rose-pastel/30 transition-colors"
                >
                  Continuar Comprando
                </Link>
                <button
                  onClick={() => navigate('/carrinho')}
                  className="flex-1 bg-rose-pastel text-rose-deep font-heading text-xs uppercase tracking-widest py-2.5 rounded-full cursor-pointer border border-rose-light/50 hover:bg-rose-light transition-colors"
                >
                  Ver Carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
