import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Pedido() {
  const { camisaId } = useParams()
  const navigate = useNavigate()

  const [camisa, setCamisa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  const [form, setForm] = useState({
    nome_cliente: '',
    email_cliente: '',
    telefone_cliente: '',
    tamanho: '',
    quantidade: 1,
    observacoes: '',
  })

  useEffect(() => {
    async function fetchCamisa() {
      const { data, error } = await supabase
        .from('camisas')
        .select('*')
        .eq('id', camisaId)
        .single()

      if (error) {
        setErro('Camisa não encontrada.')
        console.error(error)
      } else {
        setCamisa(data)
        setForm((prev) => ({ ...prev, tamanho: data.tamanhos?.[0] || '' }))
      }
      setLoading(false)
    }

    fetchCamisa()
  }, [camisaId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantidade' ? Math.max(1, parseInt(value) || 1) : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)

    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        camisa_id: camisaId,
        ...form,
      })
      .select()

    if (error) {
      setErro('Erro ao enviar pedido. Tente novamente.')
      console.error(error)
      setEnviando(false)
      return
    }

    navigate('/confirmacao', {
      state: { pedido: data[0], camisa },
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  if (!camisa) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{erro || 'Camisa não encontrada.'}</p>
        <Link to="/" className="text-amber-700 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const precoFormatado = Number(camisa.preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-amber-700 hover:underline text-sm mb-6 inline-block">
        &larr; Voltar ao catálogo
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="sm:flex">
          <img
            src={camisa.imagem_url || 'https://placehold.co/400x400?text=Sem+Foto'}
            alt={camisa.nome}
            className="sm:w-48 w-full h-48 object-cover"
          />
          <div className="p-5 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-800">{camisa.nome}</h2>
            <p className="text-gray-500 text-sm mt-1">{camisa.descricao}</p>
            <p className="text-2xl font-bold text-amber-800 mt-2">{precoFormatado}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fazer Pedido</h3>

        {erro && (
          <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{erro}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu nome *
            </label>
            <input
              type="text"
              name="nome_cliente"
              required
              value={form.nome_cliente}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Maria Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu e-mail *
            </label>
            <input
              type="email"
              name="email_cliente"
              required
              value={form.email_cliente}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="maria@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp (opcional)
            </label>
            <input
              type="tel"
              name="telefone_cliente"
              value={form.telefone_cliente}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamanho *
              </label>
              <select
                name="tamanho"
                required
                value={form.tamanho}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {camisa.tamanhos?.map((tam) => (
                  <option key={tam} value={tam}>
                    {tam}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                name="quantidade"
                min="1"
                max="10"
                required
                value={form.quantidade}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              name="observacoes"
              rows="3"
              value={form.observacoes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              placeholder="Alguma observação sobre o pedido..."
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 text-white py-3 rounded-lg font-medium cursor-pointer transition-colors"
          >
            {enviando ? 'Enviando...' : 'Enviar Pedido'}
          </button>
        </form>
      </div>
    </div>
  )
}
