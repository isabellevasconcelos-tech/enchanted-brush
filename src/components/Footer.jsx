import { Link } from 'react-router-dom'
import FloralDivider from './FloralDivider'
import HiddenStar from './HiddenStar'

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-cream-100 to-rose-pastel/40">
      <FloralDivider />
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center">
          <p className="font-display text-lg text-enchanted mb-2">Enchanted Brush Atelier</p>
          <p className="text-enchanted-muted text-sm italic mb-6">
            "Cada pincelada carrega um pedacinho de magia"
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            {[
              { to: '/shop', label: 'Loja' },
              { to: '/my-story', label: 'Minha História' },
              { to: '/hidden-stars', label: 'Estrelas' },
              { to: '/carrinho', label: 'Carrinho' },
              { to: '/limited', label: 'Limitadas' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-enchanted-muted hover:text-rose-accent no-underline text-xs font-heading uppercase tracking-widest transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-2 text-enchanted-muted/50 text-xs">
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-rose-medium">
              <path d="M6 1L7 4.5L10.5 5L7.5 7.5L8.5 11L6 9L3.5 11L4.5 7.5L1.5 5L5 4.5L6 1Z" fill="currentColor" />
            </svg>
            <span>Feito com amor e arte</span>
            <HiddenStar id="footer-secret" />
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-blue-medium">
              <path d="M6 1L7 4.5L10.5 5L7.5 7.5L8.5 11L6 9L3.5 11L4.5 7.5L1.5 5L5 4.5L6 1Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  )
}
