import { useState, useEffect } from 'react'
import { FabricImage, IText } from 'fabric'

/* ── Twemoji CDN para emojis reais em imagem ──────────────────────── */

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72'
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY || ''

function emojiUrl(cp) {
  return `${TWEMOJI_BASE}/${cp}.png`
}

/* ── Categorias ───────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    name: 'Rostos',
    icon: emojiUrl('1f60e'),
    type: 'emoji',
    items: [
      '1f600','1f603','1f604','1f601','1f606','1f605','1f923','1f602',
      '1f642','1f643','1f609','1f60a','1f607','1f970','1f60d','1f929',
      '1f618','1f617','1f61a','1f619','1f60b','1f61c','1f92a','1f61d',
      '1f911','1f917','1f92d','1f92b','1f914','1f910','1f928','1f610',
      '1f611','1f636','1f60f','1f612','1f644','1f62c','1f925','1f60c',
      '1f614','1f62a','1f924','1f634','1f637','1f912','1f915','1f922',
      '1f92e','1f927','1f975','1f976','1f974','1f635','1f92f','1f920',
      '1f973','1f978','1f60e','1f913','1f9d0','1f615','1f61f','1f641',
      '1f62e','1f62f','1f632','1f633','1f97a','1f626','1f627','1f628',
      '1f630','1f625','1f622','1f62d','1f631','1f616','1f623','1f61e',
      '1f613','1f629','1f62b','1f624','1f621','1f620','1f92c','1f608',
      '1f47f','1f480','1f47b','1f47d','1f47e','1f916','1f4a9','1f921',
    ],
  },
  {
    name: 'Gestos',
    icon: emojiUrl('1f44d'),
    type: 'emoji',
    items: [
      '1f44b','1f91a','1f590-fe0f','270b','1f596','1f44c','1f90c','1f90f',
      '270c-fe0f','1f91e','1f91f','1f918','1f919','1f448','1f449','1f446',
      '1f595','1f447','261d-fe0f','1f44d','1f44e','270a','1f44a','1f91b',
      '1f91c','1f44f','1f64c','1f450','1f932','1f91d','1f64f','270d-fe0f',
      '1f485','1f933','1f4aa','1f9be','1f9bf','1f9b5','1f9b6','1f442',
      '1f443','1f9e0','1fac0','1fac1','1f9b7','1f9b4','1f440','1f441-fe0f',
      '1f445','1f444',
    ],
  },
  {
    name: 'Animais',
    icon: emojiUrl('1f981'),
    type: 'emoji',
    items: [
      '1f436','1f431','1f42d','1f439','1f430','1f98a','1f43b','1f43c',
      '1f428','1f42f','1f981','1f42e','1f437','1f43d','1f438','1f435',
      '1f648','1f649','1f64a','1f412','1f414','1f427','1f426','1f424',
      '1f423','1f425','1f986','1f9a2','1f985','1f989','1f9a4','1fab6',
      '1f99a','1f998','1f9a9','1f54a-fe0f','1f407','1f401','1f400','1f43f-fe0f',
      '1f994','1f987','1f43b-200d-2744-fe0f','1f9a5','1f9a6','1f9a8','1f998',
      '1f99d','1f9ab','1f405','1f406','1f434','1f40e','1f984','1f993',
      '1f98c','1f9ac','1f42a','1f42b','1f999','1f998','1f403','1f402',
      '1f404','1f40d','1f409','1f432','1f995','1f996','1f433','1f40b',
      '1f42c','1f9ad','1f41f','1f420','1f421','1f988','1f419','1f41a',
      '1f40c','1f98b','1f41b','1f41c','1f41d','1f41e','1f997','1fab2',
      '1fab3','1f577-fe0f','1f578-fe0f','1f982','1f99e','1f980','1f990',
    ],
  },
  {
    name: 'Natureza',
    icon: emojiUrl('1f338'),
    type: 'emoji',
    items: [
      '1f490','1f338','1f4ae','1f3f5-fe0f','1f339','1f940','1f33a','1f33b',
      '1f33c','1f337','1f331','1fab4','1f332','1f333','1f334','1f335',
      '1f33e','1f33f','2618-fe0f','1f340','1f341','1f342','1f343',
      '1f344','1f30d','1f30e','1f30f','1f315','1f311','1f312','1f313',
      '1f314','1f316','1f317','1f318','1f319','1f31a','1f31b','1f31c',
      '1f321-fe0f','2600-fe0f','1f31e','1fa90','2b50','1f31f','1f320',
      '1f308','2601-fe0f','26c5','26c8-fe0f','1f324-fe0f','1f325-fe0f',
      '1f30a','1f525','2744-fe0f','1f4a7','1f30b','1f3d4-fe0f','26a1',
    ],
  },
  {
    name: 'Comida',
    icon: emojiUrl('1f355'),
    type: 'emoji',
    items: [
      '1f34e','1f34f','1f350','1f34a','1f34b','1f34c','1f349','1f347',
      '1f353','1fab0','1f348','1f352','1f351','1f96d','1f34d','1f965',
      '1f95d','1f345','1f346','1f951','1f966','1f955','1f33d','1f336-fe0f',
      '1f35e','1f950','1f956','1fad3','1f968','1f96f','1f9c0','1f356',
      '1f357','1f969','1f354','1f35f','1f355','1f32d','1f96a','1f32e',
      '1f32f','1fad4','1f959','1f9c6','1f95a','1f373','1f958','1f372',
      '1fad5','1f963','1f957','1f37f','1f9c8','1f370','1f382','1f967',
      '1f9c1','1f366','1f367','1f368','1f369','1f36a','1f36b','1f36c',
      '1f36d','1f36e','1f36f','2615','1fad6','1f375','1f376','1f37a',
      '1f37b','1f377','1f378','1f379','1f37e','1f944','1f9cb',
    ],
  },
  {
    name: 'Amor',
    icon: emojiUrl('2764-fe0f'),
    type: 'emoji',
    items: [
      '2764-fe0f','1f9e1','1f49b','1f49a','1f499','1f49c','1f90e','1f5a4',
      '1f90d','1f498','1f49d','1f496','1f497','1f493','1f495','1f49e',
      '1f48c','1f49f','2763-fe0f','2728','1f4ab','1f31f','1f4a5','1f4a2',
      '1f4a6','1f4a8','1f573-fe0f','1f48d','1f48e','1f451','1f3b5','1f3b6',
      '1f3b5','1f3b6','1f514','1f52e','1f9ff','1f3f4-200d-2620-fe0f',
      '262e-fe0f','2638-fe0f','2721-fe0f','1f549-fe0f','267e-fe0f',
      '269b-fe0f','2622-fe0f','2623-fe0f','26a0-fe0f','267b-fe0f',
      '2660-fe0f','2665-fe0f','2666-fe0f','2663-fe0f',
    ],
  },
  {
    name: 'Objetos',
    icon: emojiUrl('1f3ae'),
    type: 'emoji',
    items: [
      '1f3ae','1f3a8','1f3ad','1f3aa','1f3af','1f3b3','1f3b8','1f3b9',
      '1f3ba','1f3bb','1f941','1fa98','1fa95','1f3a4','1f3ac','1f4f7',
      '1f4f8','1f4f9','1f3a5','1f4fd-fe0f','1f39e-fe0f','1f4de','1f4bb',
      '1f5a5-fe0f','1f4f1','1f3a7','1f4a1','1f526','1f56f-fe0f',
      '1f4da','1f4d6','1f4d3','1f4d2','1f4d1','1f4dc','1f4c3','1f4e8',
      '1f4e9','1f4e7','1f48c','1f4ea','1f4eb','1f4ec','1f4ed',
      '1f4e6','1f511','1f5dd-fe0f','1f512','1f513','1f3c6','1f947',
      '1f948','1f949','1f3b2','1f9e9','1f9f8','1f380','1f381','1f388',
      '1f389','1f38a','1f38e','1f3ee','1f390','1f9e8','1f680','1f6f8',
      '1f6f0-fe0f','1f30c','1f52d','2694-fe0f','1f6e1-fe0f','1f5e1-fe0f',
      '1f453','1f576-fe0f','1f97d','1f48d','1f45f','1f9e2','1f451',
      '1f392','1f45c','1f45b','1f9f3','1f302','2602-fe0f',
    ],
  },
  {
    name: 'Stickers',
    icon: emojiUrl('1f3a8'),
    type: 'sticker',
    searches: [
      { label: 'Florais', query: 'floral flower art illustration' },
      { label: 'Animais', query: 'cute animal illustration cartoon' },
      { label: 'Amor', query: 'love heart romantic illustration' },
      { label: 'Tribal', query: 'tribal tattoo ornament design' },
      { label: 'Vintage', query: 'vintage retro ornament design' },
      { label: 'Fantasia', query: 'fantasy dragon unicorn magical' },
      { label: 'Espaco', query: 'space galaxy planet stars cosmic' },
      { label: 'Musica', query: 'music notes instrument art' },
      { label: 'Caveira', query: 'skull skeleton dark art' },
      { label: 'Japones', query: 'japanese cherry blossom anime art' },
    ],
  },
  {
    name: 'Frases',
    icon: emojiUrl('1f4ac'),
    type: 'text',
    items: [
      { name: 'Love Yourself', text: 'Love Yourself', font: 'Cinzel Decorative' },
      { name: 'Be Kind', text: 'Be Kind', font: 'Playfair Display' },
      { name: 'Dream Big', text: 'Dream Big', font: 'Cinzel Decorative' },
      { name: 'Stay Wild', text: 'Stay Wild', font: 'Playfair Display' },
      { name: 'Wear the Magic', text: 'Wear the magic of art.', font: 'Cinzel Decorative' },
      { name: 'Arte e Alma', text: 'Arte & Alma', font: 'Playfair Display' },
      { name: 'No Fear', text: 'No Fear', font: 'Cinzel Decorative' },
      { name: 'Free Spirit', text: 'Free Spirit', font: 'Playfair Display' },
      { name: 'Siga em Frente', text: 'Siga em Frente', font: 'Cinzel Decorative' },
      { name: 'Forca Interior', text: 'Forca Interior', font: 'Playfair Display' },
    ],
  },
]

/* ── Componente ───────────────────────────────────────────────────── */

export default function ArtPicker({ canvas }) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [activeStickerSearch, setActiveStickerSearch] = useState(null)
  const [stickerResults, setStickerResults] = useState([])
  const [stickerLoading, setStickerLoading] = useState(false)
  const [failedEmojis, setFailedEmojis] = useState(new Set())

  const category = CATEGORIES[activeCategory]

  // Auto-load first sticker sub-category when entering stickers tab
  useEffect(() => {
    if (category.type === 'sticker' && !activeStickerSearch) {
      loadStickers(category.searches[0])
    }
  }, [activeCategory])

  async function loadStickers(searchItem) {
    if (!PIXABAY_KEY) return
    setActiveStickerSearch(searchItem.label)
    setStickerLoading(true)
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(searchItem.query)}&per_page=30&image_type=illustration&safesearch=true`
      )
      if (!res.ok) throw new Error('Erro')
      const data = await res.json()
      setStickerResults(data.hits || [])
    } catch {
      setStickerResults([])
    } finally {
      setStickerLoading(false)
    }
  }

  function addImageToCanvas(url, size = 80) {
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
      const scale = Math.min(size / img.width, size / img.height)
      fabricImg.scale(scale)
      canvas.add(fabricImg)
      canvas.setActiveObject(fabricImg)
      canvas.renderAll()
    }
    img.src = url
  }

  function addTextToCanvas(item) {
    if (!canvas) return
    const centerX = canvas.width / canvas.getZoom() / 2
    const centerY = canvas.height / canvas.getZoom() / 2
    const textObj = new IText(item.text, {
      left: centerX,
      top: centerY,
      fontFamily: item.font || 'Playfair Display',
      fontSize: 24,
      fill: '#2E2214',
      fontWeight: 700,
      fontStyle: 'italic',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    })
    canvas.add(textObj)
    canvas.setActiveObject(textObj)
    canvas.renderAll()
  }

  function handleEmojiError(cp) {
    setFailedEmojis((prev) => new Set(prev).add(cp))
  }

  if (!canvas) return null

  return (
    <div className="rounded-2xl border border-gold-accent/20 overflow-hidden" style={{ background: 'linear-gradient(145deg, #352418, #3D2B1C)' }}>
      {/* Header - toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 pt-4 pb-3 cursor-pointer bg-transparent border-none"
      >
        <h3 className="font-heading text-xs text-gold-accent uppercase tracking-[0.2em]">
          Escolher Arte
        </h3>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-gold-accent/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {!open ? null : <>
      {/* Category tabs - scrollable with visible bar */}
      <div className="flex gap-1 px-3 pb-3 overflow-x-auto scrollbar-thin">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => {
              setActiveCategory(i)
              setActiveStickerSearch(null)
              setStickerResults([])
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-heading tracking-wider whitespace-nowrap cursor-pointer border transition-all duration-300 shrink-0 ${
              activeCategory === i
                ? 'bg-gold-accent/20 border-gold-accent/50 text-gold-accent'
                : 'bg-transparent border-gold-accent/10 text-enchanted-muted hover:border-gold-accent/30'
            }`}
          >
            <img src={cat.icon} alt="" className="w-4 h-4" loading="lazy" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Emoji Grid ────────────────────────────────────────────── */}
      {category.type === 'emoji' && (
        <div className="flex flex-wrap gap-3 px-4 pb-4 max-h-[340px] overflow-y-auto scrollbar-thin justify-center">
          {category.items
            .filter((cp) => !failedEmojis.has(cp))
            .map((cp) => (
              <button
                key={cp}
                onClick={() => addImageToCanvas(emojiUrl(cp), 80)}
                className="group flex items-center justify-center w-12 h-12 rounded-xl border border-gold-accent/10 cursor-pointer transition-all duration-200 hover:border-gold-accent/50 hover:bg-gold-accent/10 active:scale-90 shrink-0"
                style={{ background: 'linear-gradient(145deg, #2A1C12, #352418)' }}
                title="Adicionar ao canvas"
              >
                <img
                  src={emojiUrl(cp)}
                  alt=""
                  className="w-8 h-8 transition-transform duration-200 group-hover:scale-125"
                  loading="lazy"
                  onError={() => handleEmojiError(cp)}
                />
              </button>
            ))}
        </div>
      )}

      {/* ── Sticker Grid (Pixabay) ────────────────────────────────── */}
      {category.type === 'sticker' && (
        <>
          {/* Sub-category tabs */}
          <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto scrollbar-hide">
            {category.searches.map((s) => (
              <button
                key={s.label}
                onClick={() => loadStickers(s)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-heading tracking-wider whitespace-nowrap cursor-pointer border transition-all shrink-0 ${
                  activeStickerSearch === s.label
                    ? 'bg-rose-pastel/30 border-rose-accent/50 text-rose-accent'
                    : 'border-gold-accent/10 text-enchanted-muted hover:border-gold-accent/30'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {stickerLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin" />
            </div>
          ) : stickerResults.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 px-3 pb-4 max-h-[280px] overflow-y-auto">
              {stickerResults.map((hit) => (
                <button
                  key={hit.id}
                  onClick={() => addImageToCanvas(hit.webformatURL, 150)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-gold-accent/10 cursor-pointer hover:border-gold-accent/40 transition-all active:scale-95"
                >
                  <img
                    src={hit.previewURL}
                    alt={hit.tags || ''}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-[9px] font-heading uppercase tracking-wider transition-opacity bg-gold-accent/80 px-2 py-0.5 rounded-full">
                      Usar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-enchanted-muted text-xs text-center py-6 italic">
              {PIXABAY_KEY ? 'Nenhum resultado' : 'Configure VITE_PIXABAY_API_KEY no .env'}
            </p>
          )}

          {stickerResults.length > 0 && (
            <p className="text-enchanted-muted/40 text-[9px] text-center pb-2">
              Imagens por Pixabay
            </p>
          )}
        </>
      )}

      {/* ── Text Phrases ──────────────────────────────────────────── */}
      {category.type === 'text' && (
        <div className="grid grid-cols-2 gap-2.5 px-3 pb-4">
          {category.items.map((item) => (
            <button
              key={item.name}
              onClick={() => addTextToCanvas(item)}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gold-accent/25 cursor-pointer transition-all duration-300 hover:border-gold-accent/60 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95"
              style={{ background: 'linear-gradient(145deg, #2A1C12, #352418)' }}
            >
              <span
                className="text-gold-accent text-sm leading-tight text-center font-bold"
                style={{ fontFamily: item.font }}
              >
                {item.text}
              </span>
              <span className="text-gold-accent/50 text-[9px] font-heading tracking-wider uppercase">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
      </>}
    </div>
  )
}
