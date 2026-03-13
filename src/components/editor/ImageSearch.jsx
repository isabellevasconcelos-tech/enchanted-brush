import { useState, useRef } from 'react'
import { FabricImage } from 'fabric'

const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY || ''

export default function ImageSearch({ canvas }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef(null)

  async function search(q) {
    if (!q.trim()) { setResults([]); return }
    if (!PIXABAY_KEY) {
      setError('Configure VITE_PIXABAY_API_KEY no .env')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&per_page=18&image_type=illustration&safesearch=true`
      )
      if (!res.ok) throw new Error('Erro na busca')
      const data = await res.json()
      setResults(data.hits || [])
    } catch {
      setError('Erro ao buscar imagens. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleInput(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 500)
  }

  function addImageToCanvas(imageUrl) {
    if (!canvas) return

    const centerX = canvas.width / canvas.getZoom() / 2
    const centerY = canvas.height / canvas.getZoom() / 2

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const fabricImg = new FabricImage(img, {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
      })
      const maxDim = 150
      const scale = Math.min(maxDim / img.width, maxDim / img.height)
      fabricImg.scale(scale)

      canvas.add(fabricImg)
      canvas.setActiveObject(fabricImg)
      canvas.renderAll()
    }
    img.src = imageUrl
  }

  async function downloadAsPng(imageUrl, name) {
    try {
      const res = await fetch(imageUrl, { mode: 'cors' })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name || 'imagem'}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <div className="rounded-2xl border border-gold-accent/20 overflow-hidden" style={{ background: 'linear-gradient(145deg, #352418, #3D2B1C)' }}>
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-heading text-xs text-gold-accent uppercase tracking-[0.2em] mb-3">
          Pesquisar Imagens
        </h3>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Ex: flores, estrelas, natureza..."
            className="w-full input-enchanted rounded-xl px-4 py-2.5 pr-10 text-sm"
          />
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-accent/50"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="px-4 text-rose-accent text-[11px]">{error}</p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin" />
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 px-3 pb-3 pt-2 max-h-[280px] overflow-y-auto">
          {results.map((hit) => (
            <div key={hit.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gold-accent/10 cursor-pointer hover:border-gold-accent/40 transition-all">
              <img
                src={hit.previewURL}
                alt={hit.tags || 'Imagem'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <button
                  onClick={() => addImageToCanvas(hit.webformatURL)}
                  className="px-3 py-1 rounded-full bg-gold-accent/90 text-[10px] font-heading text-cream-50 uppercase tracking-wider cursor-pointer hover:bg-gold-accent border-none"
                >
                  Usar na Camisa
                </button>
                <button
                  onClick={() => downloadAsPng(hit.largeImageURL, hit.tags)}
                  className="px-3 py-1 rounded-full border border-white/40 text-[10px] font-heading text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 bg-transparent"
                >
                  Baixar PNG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <p className="text-enchanted-muted text-xs text-center py-4 italic">
          Nenhuma imagem encontrada
        </p>
      )}

      {results.length > 0 && (
        <p className="text-enchanted-muted/40 text-[9px] text-center pb-2">
          Imagens por Pixabay
        </p>
      )}
    </div>
  )
}
