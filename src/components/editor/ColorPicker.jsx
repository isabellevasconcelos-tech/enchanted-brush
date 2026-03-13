const SHIRT_COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Bege', hex: '#F5E6C8' },
  { name: 'Off-White', hex: '#FAF0E6' },
]

export default function ColorPicker({ selectedColor, onColorChange }) {
  return (
    <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4">
      <h3 className="font-heading text-xs text-enchanted-muted uppercase tracking-widest mb-3">
        Cor da Camisa
      </h3>
      <div className="flex flex-wrap gap-2">
        {SHIRT_COLORS.map((color) => (
          <button
            key={color.hex}
            onClick={() => onColorChange(color.hex)}
            className={`w-9 h-9 rounded-full border-2 transition-all duration-300 cursor-pointer ${
              selectedColor === color.hex
                ? 'border-gold-accent scale-110 shadow-[0_0_8px_rgba(200,150,46,0.4)]'
                : 'border-rose-light/40 hover:border-rose-medium hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
      <p className="text-enchanted-muted text-[10px] mt-2 italic">
        {SHIRT_COLORS.find((c) => c.hex === selectedColor)?.name || 'Selecione'}
      </p>
    </div>
  )
}

export { SHIRT_COLORS }
