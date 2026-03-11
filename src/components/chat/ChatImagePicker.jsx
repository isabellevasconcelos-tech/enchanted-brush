import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const TABS = [
  { id: 'upload', label: 'Enviar Foto' },
  { id: 'catalogo', label: 'Nosso Catálogo' },
  { id: 'pixabay', label: 'Buscar Inspiração' },
]

export default function ChatImagePicker({ onImageSelected }) {
  const [tab, setTab] = useState('upload')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [camisas, setCamisas] = useState([])
  const [pixabayQuery, setPixabayQuery] = useState('')
  const [pixabayImages, setPixabayImages] = useState([])
  const [searchingPixabay, setSearchingPixabay] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pixabayPage, setPixabayPage] = useState(1)
  const [pixabayTotal, setPixabayTotal] = useState(0)
  const [lastQuery, setLastQuery] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY

  // Fetch catalog products
  useEffect(() => {
    if (tab === 'catalogo' && camisas.length === 0) {
      supabase
        .from('camisas')
        .select('id, nome, imagem_url')
        .eq('disponivel', true)
        .then(({ data }) => {
          if (data) setCamisas(data)
        })
    }
  }, [tab])

  // Handle file selection
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    const MAX_SIZE = 5 * 1024 * 1024
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

    if (!ALLOWED.includes(file.type)) {
      setError('Use JPG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Máximo 5MB.')
      return
    }

    setPreview(URL.createObjectURL(file))
  }

  // Upload file to Supabase Storage
  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const fileName = `referencias/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError('Erro ao enviar imagem. Tente novamente.')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(fileName)

    setUploading(false)
    onImageSelected(urlData.publicUrl, 'upload')
  }

  // Search Pixabay
  async function fetchPixabay(query, page, append) {
    const searchQuery = encodeURIComponent(query)
    const res = await fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&per_page=40&page=${page}&lang=pt`
    )
    const data = await res.json()
    const hits = data.hits || []
    setPixabayTotal(data.totalHits || 0)
    setPixabayImages((prev) => append ? [...prev, ...hits] : hits)
  }

  async function handlePixabaySearch(e) {
    e.preventDefault()
    const trimmed = pixabayQuery.trim()
    if (!trimmed) return

    setSearchingPixabay(true)
    setPixabayPage(1)
    setLastQuery(trimmed)
    try {
      await fetchPixabay(trimmed, 1, false)
    } catch {
      setPixabayImages([])
    } finally {
      setSearchingPixabay(false)
    }
  }

  async function handleLoadMore() {
    const nextPage = pixabayPage + 1
    setLoadingMore(true)
    setPixabayPage(nextPage)
    try {
      await fetchPixabay(lastQuery, nextPage, true)
    } catch {
      // keep existing images
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 animate-chat-in">
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError('') }}
            className={`flex-1 py-2 px-2 rounded-xl text-[11px] sm:text-xs font-heading tracking-wide cursor-pointer transition-all duration-300 border ${
              tab === t.id
                ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
                : 'border-rose-light/30 bg-cream-50 text-enchanted-muted hover:border-rose-medium/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-rose-light/40 rounded-xl p-6 text-center cursor-pointer hover:border-rose-medium/60 transition-all duration-300"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-cover" />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-enchanted-muted/40 mb-2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-enchanted-muted text-xs">Toque para escolher uma foto</p>
                <p className="text-enchanted-muted/50 text-[10px] mt-1">JPG, PNG ou WebP (max 5MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {error && <p className="text-rose-deep text-xs">{error}</p>}
          {preview && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full btn-enchanted text-white font-heading text-xs uppercase tracking-widest py-3 rounded-full cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Enviando...' : 'Usar esta foto'}
            </button>
          )}
        </div>
      )}

      {/* Catalog Tab */}
      {tab === 'catalogo' && (
        <div>
          {camisas.length === 0 ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-2 border-rose-light/30 border-t-rose-medium rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {camisas.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onImageSelected(c.imagem_url || `https://placehold.co/300x300/2E2214/C8962E?text=${encodeURIComponent(c.nome)}`, 'catalogo')}
                  className="group aspect-square rounded-xl overflow-hidden border-2 border-rose-light/30 hover:border-rose-accent transition-all duration-300 cursor-pointer bg-cream-50"
                >
                  <img
                    src={c.imagem_url || `https://placehold.co/300x300/2E2214/C8962E?text=${encodeURIComponent(c.nome)}`}
                    alt={c.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pixabay Tab */}
      {tab === 'pixabay' && (
        <div className="space-y-3">
          {!API_KEY ? (
            <p className="text-enchanted-muted text-xs text-center py-4 italic">
              Busca de inspirações indisponível no momento.
            </p>
          ) : (
            <>
              <form onSubmit={handlePixabaySearch} className="flex gap-2">
                <input
                  type="text"
                  value={pixabayQuery}
                  onChange={(e) => setPixabayQuery(e.target.value)}
                  placeholder="Ex: flores, dragões..."
                  className="flex-1 input-enchanted rounded-xl px-3 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  disabled={searchingPixabay}
                  className="bg-rose-pastel hover:bg-rose-light text-rose-deep px-4 py-2.5 rounded-xl text-xs font-heading cursor-pointer transition-all duration-300 border border-rose-light/50 disabled:opacity-50"
                >
                  {searchingPixabay ? '...' : 'Buscar'}
                </button>
              </form>

              {searchingPixabay && (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-2 border-rose-light/30 border-t-rose-medium rounded-full animate-spin" />
                </div>
              )}

              {!searchingPixabay && pixabayImages.length > 0 && (
                <div>
                  <p className="text-enchanted-muted/50 text-[10px] mb-2">{pixabayTotal.toLocaleString('pt-BR')} resultados</p>
                  <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                    {pixabayImages.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => onImageSelected(img.webformatURL, 'pixabay')}
                        className="group aspect-square rounded-xl overflow-hidden border-2 border-rose-light/30 hover:border-rose-accent transition-all duration-300 cursor-pointer"
                      >
                        <img
                          src={img.previewURL}
                          alt={img.tags}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                  {pixabayImages.length < pixabayTotal && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="w-full mt-3 py-2.5 rounded-xl border border-rose-light/40 bg-cream-50 text-enchanted-muted hover:border-rose-medium/50 hover:text-enchanted font-heading text-xs tracking-wide cursor-pointer transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-rose-light/30 border-t-rose-medium rounded-full animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        'Carregar mais imagens'
                      )}
                    </button>
                  )}
                </div>
              )}

              {!searchingPixabay && pixabayImages.length === 0 && lastQuery && (
                <p className="text-enchanted-muted text-xs text-center py-4 italic">
                  Nenhuma imagem encontrada. Tente outro termo.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
