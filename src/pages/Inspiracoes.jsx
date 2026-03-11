import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Inspiracoes() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState(null)

  const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY

  async function handleSearch(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setSearched(true)
    try {
      const searchQuery = encodeURIComponent(trimmed + ' painting art')
      const res = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=illustration&per_page=20&lang=pt`
      )
      const data = await res.json()
      setImages(data.hits || [])
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-50 border border-rose-light/40 text-enchanted-muted hover:border-rose-medium/60 transition-all duration-300 no-underline"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-enchanted">Inspirações</h1>
          <p className="text-enchanted-muted text-xs sm:text-sm italic">Pesquise referências visuais para sua camisa</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: flores, carros, dragões, paisagens..."
            className="w-full px-5 py-3.5 pr-14 rounded-2xl border-2 border-rose-light/40 bg-cream-50 text-enchanted placeholder:text-enchanted-muted/40 focus:outline-none focus:border-rose-medium/60 transition-all duration-300 font-body text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-rose-pastel/50 hover:bg-rose-pastel/80 text-rose-deep transition-all duration-300 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-3 border-rose-light/30 border-t-rose-medium rounded-full animate-spin" />
          <p className="text-enchanted-muted text-sm italic">Buscando inspirações...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-50 border-2 border-rose-light/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-enchanted-muted/40">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-enchanted-muted text-sm italic mb-1">Pesquise um tema para encontrar referências</p>
          <p className="text-enchanted-muted/50 text-xs">Desenhos e ilustrações para inspirar sua camisa</p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && images.length === 0 && (
        <div className="text-center py-16">
          <p className="text-enchanted-muted text-sm italic mb-1">Nenhuma ilustração encontrada</p>
          <p className="text-enchanted-muted/50 text-xs">Tente outro termo de busca</p>
        </div>
      )}

      {/* Results grid */}
      {!loading && images.length > 0 && (
        <>
          <p className="text-enchanted-muted/50 text-xs mb-4">{images.length} ilustrações encontradas</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelected(img)}
                className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-light/30 hover:border-rose-medium/60 transition-all duration-300 hover:shadow-lg bg-cream-50 cursor-pointer"
              >
                <img
                  src={img.webformatURL}
                  alt={img.tags}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enchanted/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
          <p className="text-center text-enchanted-muted/40 text-[10px] mt-6">Imagens por Pixabay</p>
        </>
      )}

      {/* Modal/Overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-enchanted/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[85vh] bg-cream-50 rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-light/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream-50/90 border border-rose-light/40 text-enchanted-muted hover:text-enchanted transition-all duration-300 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              src={selected.largeImageURL}
              alt={selected.tags}
              className="w-full max-h-[75vh] object-contain"
            />
            <div className="px-5 py-3 border-t border-rose-light/20">
              <p className="text-enchanted-muted text-xs italic truncate">{selected.tags}</p>
            </div>
          </div>
        </div>
      )}

      {/* API key missing warning */}
      {!API_KEY && (
        <div className="mt-6 p-4 rounded-2xl border-2 border-gold-light/40 bg-gold-light/10 text-center">
          <p className="text-enchanted text-sm font-heading mb-1">Chave da API não configurada</p>
          <p className="text-enchanted-muted text-xs">
            Adicione <code className="bg-cream-100 px-1.5 py-0.5 rounded text-[11px]">VITE_PIXABAY_API_KEY</code> no arquivo <code className="bg-cream-100 px-1.5 py-0.5 rounded text-[11px]">.env</code>
          </p>
        </div>
      )}
    </div>
  )
}
