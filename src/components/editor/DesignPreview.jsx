import { useState } from 'react'
import { SHIRT_COLORS } from './ColorPicker'

export default function DesignPreview({
  frontImageDataUrl,
  backImageDataUrl,
  shirtColor,
  orderData,
  profile,
  onBack,
  onConfirm,
  enviando,
}) {
  const [previewSide, setPreviewSide] = useState('front')

  const colorName = SHIRT_COLORS.find((c) => c.hex === shirtColor)?.name || shirtColor
  const activeImage = previewSide === 'front' ? frontImageDataUrl : backImageDataUrl
  const hasBack = !!backImageDataUrl

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h2 className="font-display text-2xl text-enchanted text-center mb-1">Visualizar Design</h2>
      <p className="text-enchanted-muted text-xs italic text-center mb-4">Confira como ficou sua camisa</p>

      {/* Design preview */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 mb-4">
        {/* Front/Back toggle */}
        {hasBack && (
          <div className="flex gap-1 mb-3">
            {['front', 'back'].map((side) => (
              <button
                key={side}
                onClick={() => setPreviewSide(side)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading tracking-wide cursor-pointer transition-all duration-300 border ${
                  previewSide === side
                    ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
                    : 'border-rose-light/30 bg-cream-100 text-enchanted-muted hover:border-rose-medium/50'
                }`}
              >
                {side === 'front' ? 'Frente' : 'Costas'}
              </button>
            ))}
          </div>
        )}

        {/* Preview image */}
        <div
          className="aspect-[5/6] rounded-xl overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: shirtColor + '15' }}
        >
          {activeImage ? (
            <img src={activeImage} className="max-w-full max-h-full object-contain" alt="Preview do design" />
          ) : (
            <p className="text-enchanted-muted text-xs italic">
              {previewSide === 'front' ? 'Sem design na frente' : 'Sem design nas costas'}
            </p>
          )}
        </div>
      </div>

      {/* Order details */}
      <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 mb-4 space-y-2">
        <h3 className="font-heading text-xs text-enchanted-muted uppercase tracking-widest mb-2">Resumo</h3>

        <div className="flex items-center gap-2">
          <span className="text-enchanted-muted text-xs">Cor da camisa:</span>
          <span
            className="w-5 h-5 rounded-full border border-rose-light/40 inline-block"
            style={{ backgroundColor: shirtColor }}
          />
          <span className="text-enchanted text-xs">{colorName}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-enchanted-muted">Tamanho:</span>
          <span className="text-enchanted font-heading">{orderData.tamanho}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-enchanted-muted">Modelagem:</span>
          <span className="text-enchanted font-heading">
            {orderData.modelagem === 'babylook' ? 'Baby Look (+R$20)' : 'Slim'}
          </span>
        </div>

        {orderData.observacoes && (
          <div className="text-xs">
            <span className="text-enchanted-muted">Observacoes:</span>
            <p className="text-enchanted mt-0.5">{orderData.observacoes}</p>
          </div>
        )}

        <div className="border-t border-rose-light/20 pt-2 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-enchanted-muted">Cliente:</span>
            <span className="text-enchanted">{profile.nome}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-enchanted-muted">WhatsApp:</span>
            <span className="text-enchanted">{profile.whatsapp}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-rose-light/50 bg-cream-50 text-enchanted-muted font-heading text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:border-rose-medium"
        >
          Voltar
        </button>
        <button
          onClick={onConfirm}
          disabled={enviando}
          className="flex-[2] btn-enchanted disabled:opacity-50 text-white font-heading text-xs uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.126 1.522 5.864L.054 23.577a.5.5 0 00.608.608l5.713-1.468A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.35-1.554l-.384-.23-3.388.87.887-3.388-.23-.384A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {enviando ? 'Enviando...' : 'Confirmar pelo WhatsApp'}
        </button>
      </div>
    </div>
  )
}
