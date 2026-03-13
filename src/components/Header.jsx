import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProfile } from '../context/ProfileContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()
  const { user, profile } = useProfile()

  const links = [
    { to: '/shop', label: 'Loja', icon: '🛍' },
    { to: '/hidden-stars', label: 'Estrelas Escondidas', icon: '⭐' },
    { to: '/limited', label: 'Peças Limitadas', icon: '👑' },
    { to: '/criar-camisa', label: 'Criar Camisa', icon: '👕' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-cream-50/95 backdrop-blur-md sticky top-0 z-50 border-b border-gold-accent/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-2 group">
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive('/') ? 'bg-rose-pastel/40 border border-rose-accent shadow-md' : 'group-hover:bg-rose-pastel/20'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${isActive('/') ? 'text-rose-accent' : 'text-enchanted-muted group-hover:text-rose-accent'}`}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className={`text-[9px] font-heading tracking-wider uppercase ${isActive('/') ? 'text-rose-accent' : 'text-enchanted-muted'}`}>
              Home
            </span>
          </div>
          <div className="flex flex-col relative">
            <span className="header-brand-title font-display text-xl sm:text-2xl tracking-wide relative">
              Enchanted Brush
              {/* Mini star sparkles around the title */}
              <span className="brand-sparkle absolute" style={{ top: '-4px', left: '8px', '--s-color': '#D4AF37', '--s-size': '1.5px', '--s-speed': '2.2s', '--s-delay': '0s' }} />
              <span className="brand-sparkle absolute" style={{ top: '2px', right: '12px', '--s-color': '#C0C0C0', '--s-size': '1px', '--s-speed': '1.8s', '--s-delay': '0.6s' }} />
              <span className="brand-sparkle absolute" style={{ bottom: '0px', left: '45%', '--s-color': '#D4AF37', '--s-size': '1px', '--s-speed': '2.5s', '--s-delay': '1.2s' }} />
              <span className="brand-sparkle absolute" style={{ top: '50%', left: '-4px', '--s-color': '#C0C0C0', '--s-size': '1.5px', '--s-speed': '2s', '--s-delay': '0.3s' }} />
              <span className="brand-sparkle absolute" style={{ top: '-2px', left: '55%', '--s-color': '#FFD700', '--s-size': '1px', '--s-speed': '1.6s', '--s-delay': '0.9s' }} />
            </span>
            <span className="text-[11px] text-enchanted-muted font-heading tracking-[0.15em] italic -mt-0.5">
              Wear the magic of art.
            </span>
          </div>
        </Link>

        {/* Right side: Profile, Cart, Menu */}
        <div className="flex items-center gap-3">
          {/* Profile / Login */}
          <Link
            to={user ? '/perfil' : '/login'}
            className="no-underline flex flex-col items-center gap-0.5 group"
          >
            <div className={`relative w-9 h-9 rounded-full bg-rose-pastel/40 border border-rose-light/50 flex items-center justify-center text-lg transition-all group-hover:border-rose-accent ${
              isActive('/perfil') || isActive('/login') ? 'border-rose-accent shadow-md' : ''
            }`}>
              {user ? (profile.avatar || '🎨') : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-enchanted-muted group-hover:text-rose-accent transition-colors">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-[9px] font-heading tracking-wider uppercase ${
              isActive('/perfil') || isActive('/login') ? 'text-rose-accent' : 'text-enchanted-muted'
            }`}>
              {user ? 'Perfil' : 'Entrar'}
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/carrinho"
            className="no-underline flex flex-col items-center gap-0.5 group"
          >
            <div className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive('/carrinho')
                ? 'text-rose-accent'
                : 'text-enchanted-muted group-hover:text-rose-accent'
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-accent text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md" style={{ width: '18px', height: '18px' }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-heading tracking-wider uppercase ${
              isActive('/carrinho') ? 'text-rose-accent' : 'text-enchanted-muted'
            }`}>
              Carrinho
            </span>
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-none p-0 group"
            aria-label="Menu"
          >
            <div className="w-9 h-9 flex items-center justify-center text-enchanted group-hover:text-rose-accent transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <path d="M4 6H20M4 12H20M4 18H20" strokeLinecap="round" />
                )}
              </svg>
            </div>
            <span className="text-[9px] font-heading tracking-wider uppercase text-enchanted-muted">
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <nav className="bg-cream-50 border-t border-rose-light/30 pb-3 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 no-underline font-heading text-sm tracking-widest uppercase transition-colors ${
                isActive(link.to)
                  ? 'text-rose-accent bg-rose-pastel/30'
                  : 'text-enchanted-muted hover:text-rose-accent hover:bg-rose-pastel/20'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="h-0.5 ornament-border" />
    </header>
  )
}
