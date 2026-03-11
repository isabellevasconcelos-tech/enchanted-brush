import { useStars } from '../context/StarsContext'
import FloralDivider from '../components/FloralDivider'

export default function HiddenStars() {
  const { foundStars, totalStars, isCollected } = useStars()

  const missions = [
    { id: 'home-hero', title: 'Primeira Luz', hint: 'A magia começa na entrada. Explore a página inicial com cuidado.', icon: '🏠' },
    { id: 'shop-grid', title: 'Vitrine', hint: 'Navegue pela coleção. Uma estrela se esconde entre a arte.', icon: '🛍' },
    { id: 'product-detail', title: 'Admirador de Arte', hint: 'Olhe de perto uma obra de arte. Cada detalhe importa.', icon: '🔍' },
    { id: 'story-book', title: 'Leitor de Histórias', hint: 'Leia a história de Aurora até o final.', icon: '📖' },
    { id: 'create-form', title: 'Sonhador', hint: 'Visite o estúdio de criação. A inspiração se esconde por perto.', icon: '🎨' },
    { id: 'limited-vault', title: 'Guardião do Cofre', hint: 'A coleção limitada guarda um tesouro secreto.', icon: '👑' },
    { id: 'footer-secret', title: 'Segredo Final', hint: 'Até os menores cantos guardam magia. Role até o final.', icon: '✨' },
  ]

  const progress = (foundStars.size / totalStars) * 100

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-enchanted-muted/60 text-xs uppercase tracking-[0.3em] mb-2">Uma Missão Secreta</p>
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">
          Estrelas Escondidas
        </h1>
        <p className="text-enchanted-muted text-sm italic">
          Existem {totalStars} estrelas escondidas pelo Ateliê. Você consegue encontrar todas?
        </p>
      </div>

      <FloralDivider className="mb-8" />

      <div className="bg-cream-50 rounded-2xl border border-gold-light/40 p-6 mb-8 text-center">
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: totalStars }).map((_, i) => (
            <svg key={i} width="28" height="28" viewBox="0 0 8 8" className={`transition-all duration-500 ${i < foundStars.size ? 'text-gold-accent scale-110' : 'text-enchanted-muted/15'}`}>
              <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
            </svg>
          ))}
        </div>
        <p className="font-heading text-enchanted text-sm">
          {foundStars.size} / {totalStars} estrelas coletadas
        </p>
        <div className="w-full max-w-xs mx-auto mt-3 h-2 bg-cream-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-light via-gold-accent to-gold-medium rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        {foundStars.size === totalStars && (
          <div className="mt-4 p-4 bg-gold-pastel/40 rounded-xl border border-gold-light/50">
            <p className="text-gold-deep font-heading text-sm mb-2 animate-sparkle">
              Você descobriu a magia escondida deste ateliê.
            </p>
            <p className="text-enchanted-muted text-xs mb-3">
              Cada estrela era uma assinatura silenciosa do pincel da Isabelle. Sua recompensa — 5% de desconto:
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-5 py-2 border border-gold-accent/40">
              <span className="font-heading text-gold-deep tracking-widest text-sm">STARCOLLECTOR5</span>
              <button onClick={() => navigator.clipboard.writeText('STARCOLLECTOR5')} className="text-xs text-rose-accent hover:text-rose-deep bg-transparent border-none cursor-pointer">
                Copiar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const found = isCollected(mission.id)
          return (
            <div key={mission.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${found ? 'bg-gold-pastel/30 border-gold-light/50' : 'bg-cream-50 border-rose-light/20 hover:border-rose-light/40'}`}>
              <div className={`text-2xl ${found ? '' : 'grayscale opacity-40'}`}>{mission.icon}</div>
              <div className="flex-1">
                <h3 className={`font-heading text-sm ${found ? 'text-enchanted' : 'text-enchanted-muted'}`}>{mission.title}</h3>
                <p className="text-enchanted-muted/70 text-xs mt-0.5">{found ? 'Estrela coletada!' : mission.hint}</p>
              </div>
              {found ? (
                <svg width="24" height="24" viewBox="0 0 8 8" className="text-gold-accent"><path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" /></svg>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-enchanted-muted/20" />
              )}
            </div>
          )
        })}
      </div>

      <div className="relative mt-12 text-center">
        <FloralDivider />
        <p className="text-enchanted-muted/30 text-[10px] mt-4 italic">
          as estrelas estão espalhadas por cada canto do Ateliê...
        </p>
      </div>
    </div>
  )
}
