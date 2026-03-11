import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CamisaCard from '../components/CamisaCard'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

export default function LimitedPieces() {
  const [pieces, setPieces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLimited() {
      const { data } = await supabase
        .from('camisas')
        .select('*')
        .eq('disponivel', true)
        .order('criado_em', { ascending: true })
        .limit(6)

      if (data) setPieces(data)
      setLoading(false)
    }
    fetchLimited()
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-enchanted-muted/60 text-xs uppercase tracking-[0.3em] mb-2">👑 Coleção Exclusiva</p>
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">
          Peças Limitadas
        </h1>
        <p className="text-enchanted-muted text-sm italic max-w-md mx-auto">
          Arte vestível única. Uma vez vendida, se vai para sempre.
          Cada peça é uma pintura que nunca será replicada.
        </p>
      </div>

      <FloralDivider className="mb-10" />

      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gold-pastel/40 border border-gold-light/50 rounded-full px-5 py-2">
          <svg width="16" height="16" viewBox="0 0 8 8" className="text-gold-accent animate-sparkle"><path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" /></svg>
          <span className="font-heading text-xs uppercase tracking-widest text-gold-deep">
            Apenas 1 de cada — Feito à mão & Único
          </span>
          <svg width="16" height="16" viewBox="0 0 8 8" className="text-gold-accent animate-sparkle" style={{ animationDelay: '0.5s' }}><path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" /></svg>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-rose-light border-t-rose-accent" />
          <p className="text-enchanted-muted text-sm mt-3">Revelando a coleção...</p>
        </div>
      ) : pieces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pieces.map((camisa) => (
            <div key={camisa.id} className="relative">
              <div className="absolute top-3 left-3 z-10 bg-enchanted/80 text-gold-light text-[10px] font-heading uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                👑 1 de 1
              </div>
              <CamisaCard camisa={camisa} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">👑</p>
          <h3 className="font-heading text-lg text-enchanted mb-2">
            O cofre está sendo preparado
          </h3>
          <p className="text-enchanted-muted text-sm max-w-sm mx-auto">
            Novas peças limitadas estão sendo pintadas agora.
            Siga-nos para ser o primeiro a saber quando forem lançadas.
          </p>
        </div>
      )}

      <FloralDivider className="mt-12" />

      <section className="py-12 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl mb-2">🎨</p>
            <h3 className="font-heading text-sm text-enchanted mb-1">Pintado à Mão</h3>
            <p className="text-enchanted-muted text-xs">Cada detalhe feito à mão com amor</p>
          </div>
          <div>
            <p className="text-2xl mb-2">1️⃣</p>
            <h3 className="font-heading text-sm text-enchanted mb-1">Verdadeiramente Único</h3>
            <p className="text-enchanted-muted text-xs">Duas peças nunca serão iguais</p>
          </div>
          <div className="relative">
            <p className="text-2xl mb-2">✨</p>
            <h3 className="font-heading text-sm text-enchanted mb-1">Item de Colecionador</h3>
            <p className="text-enchanted-muted text-xs">Uma obra de arte vestível para guardar</p>
            <span className="absolute top-0 right-0"><HiddenStar id="limited-vault" /></span>
          </div>
        </div>
      </section>
    </div>
  )
}
