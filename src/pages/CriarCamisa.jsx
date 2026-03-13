import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { supabase } from '../lib/supabase'
import ShirtCanvas, { generateShirtSVG } from '../components/editor/ShirtCanvas'
import EditorToolbar from '../components/editor/EditorToolbar'
import ColorPicker from '../components/editor/ColorPicker'
import TextTool from '../components/editor/TextTool'
import ArtPicker from '../components/editor/ArtPicker'
import ImageSearch from '../components/editor/ImageSearch'
import SizeSelector from '../components/editor/SizeSelector'
import DesignPreview from '../components/editor/DesignPreview'

const WHATSAPP_NUMBER = '5551993777539'

// ── Mockup export helpers ────────────────────────────────────────────

function svgToImage(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = reject
    img.width = width
    img.height = height
    img.src = url
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function exportMockup(fabricCanvas, shirtColor, view) {
  const W = 1000
  const H = 1160

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = W
  tempCanvas.height = H
  const ctx = tempCanvas.getContext('2d')

  // 1. Draw shirt SVG as background
  const svg = generateShirtSVG(shirtColor, view)
  try {
    const shirtImg = await svgToImage(svg, W, H)
    ctx.drawImage(shirtImg, 0, 0, W, H)
  } catch {
    // Fallback: fill with shirt color
    ctx.fillStyle = shirtColor
    ctx.fillRect(0, 0, W, H)
  }

  // 2. Overlay design with multiply blend
  const designDataUrl = fabricCanvas.toDataURL({ format: 'png', multiplier: 3 })
  const designImg = await loadImage(designDataUrl)

  // Print area position (matching ShirtCanvas: top 10%, left 8%, width 84%, height 82%)
  const px = W * 0.08
  const py = H * 0.10
  const pw = W * 0.84
  const ph = H * 0.82

  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(designImg, px, py, pw, ph)
  ctx.globalCompositeOperation = 'source-over'

  return tempCanvas.toDataURL('image/png')
}

export default function CriarCamisa() {
  const { user, profile, profileComplete } = useProfile()

  // Canvas state
  const [canvas, setCanvas] = useState(null)
  const [activeView, setActiveView] = useState('front')
  const [shirtColor, setShirtColor] = useState('#FFFFFF')
  const [designs, setDesigns] = useState({ front: null, back: null })

  // History (undo/redo)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const isUndoRedoRef = useRef(false)

  // Step flow
  const [step, setStep] = useState('editor') // editor | options | preview
  const [orderData, setOrderData] = useState({
    tamanho: '',
    modelagem: 'slim',
    observacoes: '',
  })
  const [enviando, setEnviando] = useState(false)

  // Preview images
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)

  // Mobile panel
  const [mobilePanel, setMobilePanel] = useState(null) // null | 'colors' | 'text' | 'art' | 'search'

  // Handle design changes from canvas
  const handleDesignChange = useCallback((view, json) => {
    setDesigns((prev) => ({ ...prev, [view]: json }))

    // Push to undo stack
    if (!isUndoRedoRef.current) {
      setUndoStack((prev) => [...prev.slice(-30), { view, json: JSON.stringify(json) }])
      setRedoStack([])
    }
  }, [])

  // Undo
  function handleUndo() {
    if (undoStack.length < 2 || !canvas) return
    isUndoRedoRef.current = true

    const current = undoStack[undoStack.length - 1]
    const previous = undoStack[undoStack.length - 2]

    setRedoStack((prev) => [...prev, current])
    setUndoStack((prev) => prev.slice(0, -1))

    const parsed = JSON.parse(previous.json)
    canvas.loadFromJSON(parsed).then(() => {
      canvas.renderAll()
      isUndoRedoRef.current = false
    })
  }

  // Redo
  function handleRedo() {
    if (redoStack.length === 0 || !canvas) return
    isUndoRedoRef.current = true

    const next = redoStack[redoStack.length - 1]
    setUndoStack((prev) => [...prev, next])
    setRedoStack((prev) => prev.slice(0, -1))

    const parsed = JSON.parse(next.json)
    canvas.loadFromJSON(parsed).then(() => {
      canvas.renderAll()
      isUndoRedoRef.current = false
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!canvas) return
        const active = canvas.getActiveObject()
        if (active) {
          canvas.remove(active)
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, undoStack, redoStack])

  // View switching - save current view before switching
  function handleViewSwitch(newView) {
    if (newView === activeView || !canvas) return

    // Save current canvas state
    const currentJson = canvas.toJSON()
    setDesigns((prev) => ({ ...prev, [activeView]: currentJson }))

    setActiveView(newView)
  }

  // Reset canvas - clear all objects and restore defaults
  function handleReset() {
    if (!canvas) return
    const confirmed = window.confirm('Tem certeza que deseja redefinir a camisa? Todos os elementos serao removidos.')
    if (!confirmed) return

    canvas.clear()
    canvas.backgroundColor = 'transparent'
    canvas.renderAll()
    setDesigns({ front: null, back: null })
    setShirtColor('#FFFFFF')
    setActiveView('front')
    setUndoStack([])
    setRedoStack([])
  }

  // Advance to options step
  function handleGoToOptions() {
    setStep('options')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Advance to preview step - export full mockup images (shirt + design)
  async function handleGoToPreview() {
    if (!canvas) return

    // Save current view
    const currentJson = canvas.toJSON()
    const updatedDesigns = { ...designs, [activeView]: currentJson }
    setDesigns(updatedDesigns)

    // Export current view as full mockup
    const currentMockup = await exportMockup(canvas, shirtColor, activeView)

    if (activeView === 'front') {
      setFrontImage(currentMockup)

      // If back has content, load and export it
      if (updatedDesigns.back && updatedDesigns.back.objects?.length > 0) {
        await canvas.loadFromJSON(updatedDesigns.back)
        const backMockup = await exportMockup(canvas, shirtColor, 'back')
        setBackImage(backMockup)
        // Restore front
        await canvas.loadFromJSON(updatedDesigns.front)
        canvas.renderAll()
      } else {
        setBackImage(null)
      }
    } else {
      setBackImage(currentMockup)
      if (updatedDesigns.front && updatedDesigns.front.objects?.length > 0) {
        await canvas.loadFromJSON(updatedDesigns.front)
        const frontMockup = await exportMockup(canvas, shirtColor, 'front')
        setFrontImage(frontMockup)
        await canvas.loadFromJSON(updatedDesigns.back)
        canvas.renderAll()
      } else {
        setFrontImage(null)
      }
    }

    setStep('preview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Upload image to Supabase
  async function uploadDesignImage(dataUrl, side) {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const fileName = `designs/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${side}.png`

    const { error: uploadError } = await supabase.storage
      .from('fotos')
      .upload(fileName, blob, { cacheControl: '3600', upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('fotos')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  // Submit order
  async function handleConfirm() {
    setEnviando(true)

    try {
      // Upload front image
      let frontUrl = ''
      if (frontImage) {
        frontUrl = await uploadDesignImage(frontImage, 'frente')
      }

      // Upload back image if exists
      let backUrl = ''
      if (backImage) {
        backUrl = await uploadDesignImage(backImage, 'costas')
      }

      const colorName = shirtColor

      // Save to encomendas
      const { error } = await supabase.from('encomendas').insert({
        nome: profile.nome,
        email: profile.email || '',
        telefone: profile.whatsapp,
        tamanho: orderData.tamanho,
        modelagem: orderData.modelagem,
        descricao_arte: 'Design criado no editor visual',
        cores_preferidas: `Cor da camisa: ${colorName}`,
        observacoes: orderData.observacoes || null,
        imagem_referencia_url: frontUrl,
        imagem_tipo: 'editor',
      })

      if (error) {
        console.error(error)
        alert('Erro ao salvar pedido. Tente novamente.')
        setEnviando(false)
        return
      }

      // Build WhatsApp message
      const msg =
        `Ola! Criei uma camisa no editor visual:\n\n` +
        (frontUrl ? `*Design (frente):* ${frontUrl}\n` : '') +
        (backUrl ? `*Design (costas):* ${backUrl}\n` : '') +
        `*Cor da camisa:* ${colorName}\n` +
        `*Tamanho:* ${orderData.tamanho}\n` +
        `*Modelagem:* ${orderData.modelagem === 'babylook' ? 'Baby Look' : 'Slim'}\n` +
        (orderData.observacoes ? `*Observacoes:* ${orderData.observacoes}\n` : '') +
        `\n*Dados:*\n` +
        `Nome: ${profile.nome}\n` +
        `WhatsApp: ${profile.whatsapp}\n` +
        (profile.email ? `E-mail: ${profile.email}\n` : '')

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Erro ao enviar. Tente novamente.')
      setEnviando(false)
    }
  }

  // Auth/Profile guard
  if (!profileComplete) {
    const needsLogin = !user
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-rose-pastel/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-accent">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-enchanted mb-2">
          {needsLogin ? 'Faca Login' : 'Complete seu Perfil'}
        </h1>
        <p className="text-enchanted-muted text-sm italic mb-6">
          {needsLogin
            ? 'Voce precisa estar logado para criar sua camisa personalizada.'
            : 'Precisamos do seu nome, e-mail e WhatsApp para criar seu pedido.'}
        </p>
        <Link
          to={needsLogin ? '/login' : '/perfil'}
          className="inline-block btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline shadow-lg"
        >
          {needsLogin ? 'Fazer Login' : 'Ir para Perfil'}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to="/"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-accent/30 text-enchanted-muted hover:border-gold-accent/60 hover:text-gold-accent transition-all duration-300 no-underline bg-transparent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-display text-xl sm:text-2xl text-enchanted">Criar Camisa</h1>
          <p className="text-enchanted-muted text-[10px] sm:text-xs italic">Monte sua camisa visualmente</p>
        </div>
      </div>

      {/* STEP: EDITOR */}
      {step === 'editor' && (
        <>
          {/* Toolbar */}
          <div className="mb-4">
            <EditorToolbar
              canvas={canvas}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={undoStack.length > 1}
              canRedo={redoStack.length > 0}
              onReset={handleReset}
              onOpenColors={() => setMobilePanel(mobilePanel === 'colors' ? null : 'colors')}
            />
          </div>

          {/* Front/Back toggle */}
          <div className="flex gap-1 mb-4 max-w-[300px] mx-auto">
            {['front', 'back'].map((view) => (
              <button
                key={view}
                onClick={() => handleViewSwitch(view)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading tracking-wide cursor-pointer transition-all duration-300 border ${
                  activeView === view
                    ? 'border-gold-accent/60 bg-gold-accent/15 text-gold-accent'
                    : 'border-gold-accent/15 bg-transparent text-enchanted-muted hover:border-gold-accent/40'
                }`}
              >
                {view === 'front' ? 'Frente' : 'Costas'}
              </button>
            ))}
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Canvas area */}
            <div className="w-full lg:w-2/3">
              <div className="rounded-2xl border border-gold-accent/20 p-4 sm:p-6 overflow-hidden" style={{ background: 'linear-gradient(145deg, #352418, #3D2B1C)' }}>
                <ShirtCanvas
                  onCanvasReady={setCanvas}
                  shirtColor={shirtColor}
                  activeView={activeView}
                  designs={designs}
                  onDesignChange={handleDesignChange}
                />
                <p className="text-enchanted-muted text-[10px] text-center mt-3 italic">
                  Arraste, redimensione e rotacione os elementos no canvas
                </p>
              </div>
            </div>

            {/* Side panel - desktop only */}
            <div className="hidden lg:flex lg:w-1/3 flex-col gap-4">
              <ArtPicker canvas={canvas} />
              <ImageSearch canvas={canvas} />
              <ColorPicker selectedColor={shirtColor} onColorChange={setShirtColor} />
              <TextTool canvas={canvas} />
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="lg:hidden flex gap-2 mb-4 justify-center">
            {[
              { key: 'art', label: 'Artes', icon: '🎨' },
              { key: 'search', label: 'Buscar', icon: '🔍' },
              { key: 'colors', label: 'Cores', icon: '🎯' },
              { key: 'text', label: 'Texto', icon: '✏️' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMobilePanel(mobilePanel === tab.key ? null : tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-heading tracking-wider cursor-pointer border-2 transition-all duration-300 shadow-sm ${
                  mobilePanel === tab.key
                    ? 'bg-gold-accent/25 border-gold-accent text-gold-accent shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'border-gold-accent/40 text-gold-accent/80 hover:border-gold-accent/70 hover:text-gold-accent'
                }`}
                style={{ background: mobilePanel === tab.key ? undefined : 'linear-gradient(145deg, #2A1C12, #352418)' }}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile bottom panel */}
          {mobilePanel && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 border-t border-gold-accent/20 rounded-t-2xl p-4 z-50 max-h-[50vh] overflow-y-auto animate-fade-in" style={{ background: 'linear-gradient(145deg, #1A0A12, #22101A)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-heading text-xs text-gold-accent uppercase tracking-widest">
                  {mobilePanel === 'colors' ? 'Cor da Camisa' : mobilePanel === 'art' ? 'Escolher Arte' : mobilePanel === 'search' ? 'Pesquisar Imagens' : 'Texto'}
                </span>
                <button
                  onClick={() => setMobilePanel(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gold-accent/20 text-enchanted-muted cursor-pointer bg-transparent hover:border-gold-accent/40"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {mobilePanel === 'art' && <ArtPicker canvas={canvas} />}
              {mobilePanel === 'search' && <ImageSearch canvas={canvas} />}
              {mobilePanel === 'colors' && (
                <ColorPicker selectedColor={shirtColor} onColorChange={setShirtColor} />
              )}
              {mobilePanel === 'text' && <TextTool canvas={canvas} />}
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleGoToOptions}
            className="w-full btn-enchanted text-white font-heading text-sm uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg"
          >
            Proximo: Escolher Tamanho
          </button>
        </>
      )}

      {/* STEP: OPTIONS */}
      {step === 'options' && (
        <SizeSelector
          orderData={orderData}
          onOrderDataChange={(field, value) =>
            setOrderData((prev) => ({ ...prev, [field]: value }))
          }
          onBack={() => setStep('editor')}
          onContinue={handleGoToPreview}
        />
      )}

      {/* STEP: PREVIEW */}
      {step === 'preview' && (
        <DesignPreview
          frontImageDataUrl={frontImage}
          backImageDataUrl={backImage}
          shirtColor={shirtColor}
          orderData={orderData}
          profile={profile}
          onBack={() => setStep('options')}
          onConfirm={handleConfirm}
          enviando={enviando}
        />
      )}
    </div>
  )
}
