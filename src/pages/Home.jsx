import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CamisaCard from '../components/CamisaCard'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

export default function Home() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    async function fetchDestaques() {
      const { data } = await supabase
        .from('camisas')
        .select('*')
        .eq('disponivel', true)
        .order('criado_em', { ascending: false })
        .limit(3)

      if (data) setDestaques(data)
    }
    fetchDestaques()
  }, [])

  const menuItems = [
    {
      to: '/shop',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:stroke-rose-accent">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
      title: 'Loja',
      desc: 'Explore a coleção pintada à mão',
      color: 'rose',
    },
    {
      to: '/limited',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:stroke-rose-accent">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      title: 'Peças Limitadas',
      desc: 'Edições exclusivas e únicas',
      color: 'gold',
    },
    {
      to: '/hidden-stars',
      icon: (
        <svg width="32" height="32" viewBox="0 0 8 8" fill="currentColor" className="text-enchanted-muted/60 transition-all duration-500 group-hover:text-gold-accent">
          <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" />
        </svg>
      ),
      title: 'Estrelas Escondidas',
      desc: 'Uma missão secreta te espera',
      color: 'gold',
    },
    {
      to: '/inspiracoes',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:stroke-rose-accent">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      title: 'Inspirações',
      desc: 'Pesquise referências para sua camisa',
      color: 'rose',
    },
    {
      to: '/personalizar',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:stroke-rose-accent">
          <path d="M12 20h9" />
          <path d="M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.838.838-2.872a2 2 0 01.506-.855z" />
        </svg>
      ),
      title: 'Personalizar',
      desc: 'Crie sua camisa sob medida',
      color: 'gold',
    },
    {
      to: 'https://wa.me/5551993777539?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido.%0ANome%3A%20%0ATamanho%3A%20',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-enchanted-muted/70 transition-all duration-500 group-hover:text-green-500">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      title: 'Faça Seu Pedido',
      desc: 'Peça pelo WhatsApp: nome e tamanho',
      color: 'rose',
      external: true,
    },
  ]

  const borderColors = {
    rose: 'border-rose-light/40 hover:border-rose-medium/60',
    blue: 'border-blue-light/40 hover:border-blue-medium/60',
    gold: 'border-gold-light/40 hover:border-gold-medium/60',
  }

  return (
    <div className="animate-fade-in">
      <section className="relative text-center py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-6 left-6 text-rose-medium/15 animate-float" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" />
            <path d="M12 12C12 12 16 10 18 10C20 10 22 12 22 12C22 12 20 14 18 14C16 14 12 12 12 12Z" />
            <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" />
            <path d="M12 12C12 12 8 10 6 10C4 10 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z" />
            <circle cx="12" cy="12" r="2" fill="#FCD34D" />
          </svg>
          <svg className="absolute top-16 right-10 text-blue-medium/15 animate-sparkle" width="18" height="18" viewBox="0 0 8 8" fill="currentColor">
            <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" />
          </svg>
          <span className="absolute bottom-8 right-[18%]"><HiddenStar id="home-hero" /></span>
        </div>

        <h1 className="home-brand-title font-display text-4xl sm:text-5xl lg:text-6xl mb-3 leading-tight relative inline-block">
          Enchanted Brush
          {/* Gold sparkles */}
          <span className="brand-sparkle absolute" style={{ top: '-10px', left: '15%', '--s-color': '#D4AF37', '--s-size': '2.5px', '--s-speed': '2s', '--s-delay': '0s' }} />
          <span className="brand-sparkle absolute" style={{ top: '-6px', right: '10%', '--s-color': '#FFD700', '--s-size': '2px', '--s-speed': '1.7s', '--s-delay': '0.8s' }} />
          <span className="brand-sparkle absolute" style={{ top: '5px', left: '-8px', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2.4s', '--s-delay': '0.4s' }} />
          <span className="brand-sparkle absolute" style={{ bottom: '-6px', left: '30%', '--s-color': '#FFD700', '--s-size': '2.5px', '--s-speed': '1.9s', '--s-delay': '1.1s' }} />
          <span className="brand-sparkle absolute" style={{ bottom: '-8px', right: '20%', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2.2s', '--s-delay': '0.2s' }} />
          {/* Silver sparkles */}
          <span className="brand-sparkle absolute" style={{ top: '0px', right: '-6px', '--s-color': '#C0C0C0', '--s-size': '2px', '--s-speed': '2.1s', '--s-delay': '0.5s' }} />
          <span className="brand-sparkle absolute" style={{ top: '-12px', left: '50%', '--s-color': '#E0E0E0', '--s-size': '1.5px', '--s-speed': '1.5s', '--s-delay': '1.3s' }} />
          <span className="brand-sparkle absolute" style={{ bottom: '-4px', left: '65%', '--s-color': '#C0C0C0', '--s-size': '2px', '--s-speed': '2.3s', '--s-delay': '0.7s' }} />
          <span className="brand-sparkle absolute" style={{ top: '50%', left: '-12px', '--s-color': '#E0E0E0', '--s-size': '1.5px', '--s-speed': '1.8s', '--s-delay': '1.5s' }} />
          <span className="brand-sparkle absolute" style={{ top: '50%', right: '-10px', '--s-color': '#D4AF37', '--s-size': '2.5px', '--s-speed': '2s', '--s-delay': '0.6s' }} />
        </h1>
        <p className="text-enchanted-muted text-base sm:text-lg max-w-md mx-auto italic">
          Camisas pintadas à mão, feitas com amor e magia
        </p>
      </section>

      <FloralDivider />

      <section className="py-10">
        {/* Card Nossa História — destaque acima do menu */}
        <Link
          to="/my-story"
          className="home-card group block max-w-lg mx-auto mb-4 sm:mb-5 rounded-2xl overflow-hidden no-underline relative border border-rose-light/40 bg-cream-50 transition-all duration-500 hover:border-rose-medium/60 hover:shadow-[0_0_25px_rgba(139,26,43,0.25),0_0_50px_rgba(200,150,46,0.1)] active:scale-[0.98]"
        >
          {/* Barra bordo no topo */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-rose-accent to-transparent" />

          <div className="flex items-center gap-4 p-4 sm:p-5">
            {/* Ícone livro/pergaminho */}
            <span className="home-card-icon w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-cream-200/60 text-gold-light/70 transition-all duration-500 group-hover:bg-rose-pastel/50 group-hover:text-rose-accent group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(139,26,43,0.3)]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:stroke-rose-accent">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </span>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <span className="font-heading text-xs sm:text-sm text-enchanted uppercase tracking-widest leading-tight block">
                Nossa História
              </span>
              <span className="text-enchanted-muted text-[10px] sm:text-xs leading-relaxed block mt-0.5">
                A jornada por trás de cada pincelada
              </span>
            </div>

            {/* Seta */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-light/50 group-hover:text-gold-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* Sparkles */}
          <span className="brand-sparkle absolute" style={{ top: '6px', right: '10px', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2s', '--s-delay': '0.3s' }} />
          <span className="brand-sparkle absolute" style={{ bottom: '6px', left: '10px', '--s-color': '#C0C0C0', '--s-size': '1.5px', '--s-speed': '1.8s', '--s-delay': '1s' }} />
        </Link>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-lg mx-auto">
          {menuItems.map((item) => {
            const cardClass = `home-card group flex flex-col items-center text-center gap-2 sm:gap-3 p-5 sm:p-7 bg-cream-50 rounded-2xl border border-gold-light/30 no-underline transition-all duration-500 hover:shadow-[0_0_25px_rgba(200,150,46,0.25),0_0_50px_rgba(200,150,46,0.1)] hover:border-gold-accent/60 active:scale-[0.97]`
            const inner = (
              <>
                <span className="home-card-icon w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-cream-200/60 text-gold-light/70 transition-all duration-500 group-hover:bg-gold-pastel/50 group-hover:text-gold-accent group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(200,150,46,0.3)]">
                  {item.icon}
                </span>
                <span className="font-heading text-xs sm:text-sm text-enchanted uppercase tracking-widest leading-tight">
                  {item.title}
                </span>
                <span className="text-enchanted-muted text-[10px] sm:text-xs leading-relaxed">
                  {item.desc}
                </span>
              </>
            )
            return item.external ? (
              <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer" className={cardClass}>
                {inner}
              </a>
            ) : (
              <Link key={item.to} to={item.to} className={cardClass}>
                {inner}
              </Link>
            )
          })}
        </div>
      </section>

      <FloralDivider />

      {/* Catálogo em Destaque */}
      {destaques.length > 0 && (
        <section className="py-10">
          <Link
            to="/shop"
            className="catalog-featured group block max-w-2xl mx-auto rounded-2xl overflow-hidden no-underline relative border border-gold-light/40 transition-all duration-500 hover:border-gold-accent/70 hover:shadow-[0_0_30px_rgba(200,150,46,0.3),0_0_60px_rgba(200,150,46,0.1)]"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-gold-pastel/50 z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,150,46,0.12),transparent_60%)] z-0" />

            {/* Top bar accent */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-accent to-transparent z-10 relative" />

            <div className="relative z-10 p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gold-pastel/60 border border-gold-light/50 group-hover:shadow-[0_0_12px_rgba(200,150,46,0.4)] transition-all duration-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-accent">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-display text-lg sm:text-xl text-enchanted leading-tight">
                    Nosso Catálogo
                  </h2>
                  <p className="text-enchanted-muted text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                    Arte feita à mão
                  </p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gold-light/60 group-hover:text-gold-accent group-hover:translate-x-1 transition-all duration-300">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              {/* Product thumbnails */}
              <div className="flex gap-2 sm:gap-3 mb-4">
                {destaques.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex-1 aspect-square rounded-xl overflow-hidden border border-gold-light/30 group-hover:border-gold-accent/50 transition-all duration-500 relative"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <img
                      src={c.imagem_url || `https://placehold.co/300x300/2E2214/C8962E?text=${encodeURIComponent(c.nome)}`}
                      alt={c.nome}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cream-50/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-0 right-0 text-center font-heading text-[9px] sm:text-[10px] text-enchanted-light truncate px-1">
                      {c.nome}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <p className="text-enchanted-muted text-xs italic">
                  {destaques.length} peças em destaque
                </p>
                <span className="bg-gold-pastel/60 border border-gold-light/50 text-gold-deep font-heading text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1.5 rounded-full group-hover:bg-gold-accent/20 group-hover:border-gold-accent/60 group-hover:shadow-[0_0_8px_rgba(200,150,46,0.3)] transition-all duration-300">
                  Ver Coleção
                </span>
              </div>
            </div>

            {/* Bottom bar accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-light/40 to-transparent z-10 relative" />

            {/* Corner sparkles */}
            <span className="brand-sparkle absolute" style={{ top: '8px', right: '12px', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2.2s', '--s-delay': '0s' }} />
            <span className="brand-sparkle absolute" style={{ bottom: '8px', left: '12px', '--s-color': '#FFD700', '--s-size': '1.5px', '--s-speed': '1.8s', '--s-delay': '0.6s' }} />
            <span className="brand-sparkle absolute" style={{ top: '50%', right: '8px', '--s-color': '#C0C0C0', '--s-size': '1.5px', '--s-speed': '2s', '--s-delay': '1.2s' }} />
          </Link>
        </section>
      )}
    </div>
  )
}
