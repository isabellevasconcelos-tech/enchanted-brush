import { useState, useEffect } from 'react'

const FONTS = [
  { name: 'Lora', label: 'Lora' },
  { name: 'Playfair Display', label: 'Playfair' },
  { name: 'Cinzel Decorative', label: 'Cinzel' },
  { name: 'Georgia', label: 'Georgia' },
  { name: 'Arial', label: 'Arial' },
]

const TEXT_COLORS = [
  '#1A1A1A', '#FFFFFF', '#F5E6C8', '#8B1A2B', '#C8962E',
  '#1B2A4A', '#3B4A2A', '#A0522D', '#6B6B6B', '#D4AF37',
]

export default function TextTool({ canvas }) {
  const [activeText, setActiveText] = useState(null)
  const [fontFamily, setFontFamily] = useState('Lora')
  const [fontSize, setFontSize] = useState(28)
  const [fill, setFill] = useState('#1A1A1A')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)

  useEffect(() => {
    if (!canvas) return

    function handleSelection() {
      const obj = canvas.getActiveObject()
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        setActiveText(obj)
        setFontFamily(obj.fontFamily || 'Lora')
        setFontSize(obj.fontSize || 28)
        setFill(obj.fill || '#1A1A1A')
        setBold(obj.fontWeight === 'bold')
        setItalic(obj.fontStyle === 'italic')
      } else {
        setActiveText(null)
      }
    }

    function handleCleared() {
      setActiveText(null)
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleCleared)

    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared', handleCleared)
    }
  }, [canvas])

  function updateProp(prop, value) {
    if (!activeText) return
    activeText.set(prop, value)
    canvas.renderAll()
  }

  if (!activeText) return null

  return (
    <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 space-y-3 animate-fade-in">
      <h3 className="font-heading text-xs text-enchanted-muted uppercase tracking-widest">
        Propriedades do Texto
      </h3>

      {/* Font family */}
      <div>
        <label className="text-enchanted-muted text-[10px] block mb-1">Fonte</label>
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value)
            updateProp('fontFamily', e.target.value)
          }}
          className="w-full input-enchanted rounded-lg px-3 py-2 text-xs cursor-pointer"
        >
          {FONTS.map((f) => (
            <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <label className="text-enchanted-muted text-[10px] block mb-1">Tamanho: {fontSize}px</label>
        <input
          type="range"
          min="12"
          max="72"
          value={fontSize}
          onChange={(e) => {
            const val = Number(e.target.value)
            setFontSize(val)
            updateProp('fontSize', val)
          }}
          className="w-full accent-rose-accent cursor-pointer"
        />
      </div>

      {/* Text color */}
      <div>
        <label className="text-enchanted-muted text-[10px] block mb-1">Cor</label>
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setFill(color)
                updateProp('fill', color)
              }}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                fill === color
                  ? 'border-gold-accent scale-110'
                  : 'border-rose-light/30 hover:border-rose-medium'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Bold / Italic */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const newBold = !bold
            setBold(newBold)
            updateProp('fontWeight', newBold ? 'bold' : 'normal')
          }}
          className={`flex-1 py-2 rounded-lg border text-xs font-heading cursor-pointer transition-all duration-200 ${
            bold
              ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
              : 'border-rose-light/40 bg-cream-100 text-enchanted-muted hover:border-rose-medium'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => {
            const newItalic = !italic
            setItalic(newItalic)
            updateProp('fontStyle', newItalic ? 'italic' : 'normal')
          }}
          className={`flex-1 py-2 rounded-lg border text-xs font-heading cursor-pointer transition-all duration-200 ${
            italic
              ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
              : 'border-rose-light/40 bg-cream-100 text-enchanted-muted hover:border-rose-medium'
          }`}
        >
          <em>I</em>
        </button>
      </div>
    </div>
  )
}
