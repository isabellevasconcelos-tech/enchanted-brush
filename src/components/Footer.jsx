import { Link } from 'react-router-dom'
import FloralDivider from './FloralDivider'
import HiddenStar from './HiddenStar'

const HORARIOS = [
  { dia: 'Domingo', horario: '09:00 – 23:00' },
  { dia: 'Segunda-feira', horario: '13:00 – 19:30' },
  { dia: 'Terca-feira', horario: '13:00 – 19:30' },
  { dia: 'Quarta-feira', horario: '12:30 – 18:00' },
  { dia: 'Quinta-feira', horario: '13:00 – 19:30' },
  { dia: 'Sexta-feira', horario: '13:00 – 18:00' },
  { dia: 'Sabado', horario: 'Fechado' },
]

export default function Footer() {
  const hoje = new Date().getDay() // 0 = domingo

  return (
    <footer className="mt-auto bg-gradient-to-b from-cream-100 via-cream-50 to-[#120610]">
      <FloralDivider />
      <div className="container mx-auto px-4 pb-8">
        {/* Brand name + quote */}
        <div className="text-center mb-8">
          <p className="font-display text-lg text-enchanted mb-2">Enchanted Brush Atelier</p>
          <p className="text-enchanted-muted text-sm italic">
            "Cada pincelada carrega um pedacinho de magia"
          </p>
        </div>

        {/* 3-column grid: Atendimento | Links | Horarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* ── Atendimento ── */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-xs text-enchanted uppercase tracking-[0.2em] mb-4">
              Atendimento
            </h4>
            <div className="space-y-3">
              {/* Telefone */}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-accent shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <a href="tel:+5551993777539" className="text-enchanted-muted text-sm no-underline hover:text-rose-accent transition-colors">
                  (51) 99377-7539
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.126 1.522 5.864L.054 23.577a.5.5 0 00.608.608l5.713-1.468A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.35-1.554l-.384-.23-3.388.87.887-3.388-.23-.384A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                <a
                  href="https://wa.me/5551993777539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-enchanted-muted text-sm no-underline hover:text-green-500 transition-colors"
                >
                  (51) 99377-7539
                </a>
              </div>

              {/* Gmail */}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-accent shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
                <a
                  href="mailto:enchanted.brush.atelier@gmail.com"
                  className="text-enchanted-muted text-sm no-underline hover:text-rose-accent transition-colors break-all"
                >
                  enchanted.brush.atelier
                </a>
              </div>
            </div>
          </div>

          {/* ── Links rapidos ── */}
          <div className="text-center">
            <h4 className="font-heading text-xs text-enchanted uppercase tracking-[0.2em] mb-4">
              Navegue
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/shop', label: 'Loja' },
                { to: '/my-story', label: 'Minha Historia' },
                { to: '/criar-camisa', label: 'Criar Camisa' },
                { to: '/personalizar', label: 'Personalizar' },
                { to: '/hidden-stars', label: 'Estrelas Escondidas' },
                { to: '/limited', label: 'Edicoes Limitadas' },
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
          </div>

          {/* ── Horario de Atendimento ── */}
          <div className="text-center md:text-right">
            <h4 className="font-heading text-xs text-enchanted uppercase tracking-[0.2em] mb-4">
              Horario de Atendimento
            </h4>
            <div className="space-y-1.5">
              {HORARIOS.map((h, i) => {
                const isHoje = i === hoje
                const fechado = h.horario === 'Fechado'
                return (
                  <div
                    key={h.dia}
                    className={`flex items-center justify-center md:justify-end gap-2 text-xs ${
                      isHoje ? 'text-rose-accent font-semibold' : 'text-enchanted-muted'
                    }`}
                  >
                    <span className="w-28 text-right">{h.dia}</span>
                    <span className={fechado ? 'text-red-400/70' : ''}>
                      {h.horario}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-rose-light/20 pt-4">
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
