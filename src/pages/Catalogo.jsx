import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CamisaCard from '../components/CamisaCard'

export default function Catalogo() {
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
        setErro('Erro ao carregar camisas. Tente novamente.')
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  if (erro) {
    return <p className="text-center text-red-600 py-10">{erro}</p>
  }

  if (camisas.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Nenhuma camisa disponível no momento.
      </p>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Nossas Camisas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {camisas.map((camisa) => (
          <CamisaCard key={camisa.id} camisa={camisa} />
        ))}
      </div>
    </div>
  )
}
