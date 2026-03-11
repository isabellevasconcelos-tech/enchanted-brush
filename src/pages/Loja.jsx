import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CamisaCard from '../components/CamisaCard'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

export default function Loja() {
  const [camisas, setCamisas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function fetchCamisas() {
      const { data, error } = await supabase
        .from('camisas')
        .select('*')
        .eq('disponivel', true)
        .order('criado_em', { ascending: false })

      if (error) {
        setErro('Erro ao carregar a coleção. Tente novamente.')
        console.error(error)
      } else {
        setCamisas(data)
      }
      setLoading(false)
    }

    fetchCamisas()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-light border-t-rose-accent" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 8 8"
            className="absolute -top-1 -right-1 text-gold-accent animate-sparkle"
          >
            <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
          </svg>
        </div>
        <p className="text-enchanted-muted text-sm italic">Carregando a coleção...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="text-center py-10">
        <p className="text-rose-deep bg-rose-pastel/50 inline-block px-6 py-3 rounded-full text-sm">
          {erro}
        </p>
      </div>
    )
  }

  if (camisas.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-enchanted-muted italic text-lg">
          Nenhuma peça disponível no momento...
        </p>
        <p className="text-enchanted-muted/50 text-sm mt-2">
          Novas criações estão a caminho!
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">
          Nossa Coleção
        </h1>
        <p className="text-enchanted-muted text-sm italic">
          Peças únicas pintadas a mão com amor
        </p>
      </div>

      <FloralDivider className="mb-8" />

      <div className="relative">
        <span className="absolute -top-2 right-4"><HiddenStar id="shop-grid" /></span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {camisas.map((camisa) => (
          <CamisaCard key={camisa.id} camisa={camisa} />
        ))}
      </div>
    </div>
  )
}
