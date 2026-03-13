import { useRef } from 'react'
import { FabricImage, IText } from 'fabric'

export default function EditorToolbar({ canvas, onUndo, onRedo, canUndo, canRedo, onOpenColors, onOpenText, onReset }) {
  const fileInputRef = useRef(null)

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !canvas) return
    e.target.value = ''

    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
    if (!ALLOWED.includes(file.type)) {
      alert('Formato invalido. Use JPG, PNG ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Maximo 5MB.')
      return
    }

    const url = URL.createObjectURL(file)
    FabricImage.fromURL(url).then((img) => {
      const maxW = canvas.width * 0.6
      if (img.width > maxW) {
        img.scaleToWidth(maxW)
      } else {
        img.scaleToWidth(Math.min(img.width, 200))
      }
      img.set({
        left: canvas.width / 2 - (img.getScaledWidth() / 2),
        top: canvas.height / 2 - (img.getScaledHeight() / 2),
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }

  function handleAddText() {
    if (!canvas) return
    const text = new IText('Seu texto', {
      left: canvas.width / 2 - 60,
      top: canvas.height / 2 - 14,
      fontFamily: 'Lora',
      fontSize: 28,
      fill: '#1A1A1A',
      editable: true,
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  function handleDelete() {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active) {
      canvas.remove(active)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  function handleBringFront() {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active) {
      canvas.bringObjectToFront(active)
      canvas.renderAll()
    }
  }

  function handleSendBack() {
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active) {
      canvas.sendObjectToBack(active)
      canvas.renderAll()
    }
  }

  const tools = [
    {
      id: 'upload',
      label: 'Enviar Imagem',
      action: () => fileInputRef.current?.click(),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      id: 'text',
      label: 'Adicionar Texto',
      action: handleAddText,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      id: 'delete',
      label: 'Deletar',
      action: handleDelete,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      ),
    },
    {
      id: 'undo',
      label: 'Desfazer',
      action: onUndo,
      disabled: !canUndo,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
      ),
    },
    {
      id: 'redo',
      label: 'Refazer',
      action: onRedo,
      disabled: !canRedo,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 11-2.13-9.36L23 10" />
        </svg>
      ),
    },
    {
      id: 'front',
      label: 'Trazer Frente',
      action: handleBringFront,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2" width="13" height="13" rx="2" />
          <rect x="3" y="9" width="13" height="13" rx="2" />
        </svg>
      ),
    },
    {
      id: 'back',
      label: 'Enviar Tras',
      action: handleSendBack,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="2" width="13" height="13" rx="2" />
          <rect x="8" y="9" width="13" height="13" rx="2" />
        </svg>
      ),
    },
    {
      id: 'reset',
      label: 'Redefinir Camisa',
      action: onReset,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.51 15a9 9 0 104.32-8.26" />
          <polyline points="1 4 1 10 7 10" />
          <line x1="9" y1="15" x2="15" y2="9" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  ]

  // Add mobile-only buttons for color and text panels
  if (onOpenColors) {
    tools.push({
      id: 'colors-mobile',
      label: 'Cores',
      action: onOpenColors,
      mobileOnly: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="2" fill="currentColor" />
          <circle cx="8" cy="14" r="2" fill="currentColor" />
          <circle cx="16" cy="14" r="2" fill="currentColor" />
        </svg>
      ),
    })
  }

  return (
    <div className="flex items-center gap-2 bg-cream-50 rounded-2xl border border-rose-light/30 p-3 overflow-x-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={tool.action}
          disabled={tool.disabled}
          className={`w-10 h-10 rounded-xl border border-rose-light/40 bg-cream-100 text-enchanted-muted hover:text-rose-accent hover:border-rose-accent disabled:opacity-30 transition-all duration-300 cursor-pointer flex items-center justify-center flex-shrink-0 ${
            tool.mobileOnly ? 'lg:hidden' : ''
          }`}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}
