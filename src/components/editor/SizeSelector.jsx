export default function SizeSelector({ orderData, onOrderDataChange, onBack, onContinue }) {
  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h2 className="font-display text-2xl text-enchanted mb-1 text-center">Detalhes do Pedido</h2>
      <p className="text-enchanted-muted text-xs italic text-center mb-6">Escolha o tamanho e modelagem</p>

      {/* Size selection */}
      <div className="mb-6">
        <label className="font-heading text-xs text-enchanted-muted uppercase tracking-widest block mb-2">Tamanho</label>
        <div className="grid grid-cols-4 gap-2">
          {['P', 'M', 'G', 'GG'].map((tam) => (
            <button
              key={tam}
              onClick={() => onOrderDataChange('tamanho', tam)}
              className={`py-3 rounded-xl border-2 font-heading text-sm cursor-pointer transition-all duration-300 ${
                orderData.tamanho === tam
                  ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
                  : 'border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/20'
              }`}
            >
              {tam}
            </button>
          ))}
        </div>
      </div>

      {/* Fit selection */}
      <div className="mb-6">
        <label className="font-heading text-xs text-enchanted-muted uppercase tracking-widest block mb-2">Modelagem</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onOrderDataChange('modelagem', 'slim')}
            className={`py-3.5 rounded-xl border-2 font-heading text-sm cursor-pointer transition-all duration-300 ${
              orderData.modelagem === 'slim'
                ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
                : 'border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/20'
            }`}
          >
            Slim
          </button>
          <button
            onClick={() => onOrderDataChange('modelagem', 'babylook')}
            className={`py-3.5 rounded-xl border-2 font-heading text-sm cursor-pointer transition-all duration-300 ${
              orderData.modelagem === 'babylook'
                ? 'border-rose-accent bg-rose-pastel/30 text-rose-accent'
                : 'border-rose-light/50 bg-cream-50 text-enchanted hover:border-rose-accent hover:bg-rose-pastel/20'
            }`}
          >
            Baby Look <span className="text-[10px] text-enchanted-muted">(+R$20)</span>
          </button>
        </div>
      </div>

      {/* Observations */}
      <div className="mb-6">
        <label className="font-heading text-xs text-enchanted-muted uppercase tracking-widest block mb-2">
          Observacoes <span className="normal-case text-enchanted-muted/60">(opcional)</span>
        </label>
        <textarea
          value={orderData.observacoes}
          onChange={(e) => onOrderDataChange('observacoes', e.target.value)}
          className="w-full input-enchanted rounded-xl p-4 text-sm resize-none"
          rows={3}
          placeholder="Detalhes extras, posicao da arte, algo especifico..."
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-rose-light/50 bg-cream-50 text-enchanted-muted font-heading text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:border-rose-medium"
        >
          Voltar
        </button>
        <button
          onClick={onContinue}
          disabled={!orderData.tamanho}
          className="flex-[2] btn-enchanted disabled:opacity-40 text-white font-heading text-xs uppercase tracking-widest py-3.5 rounded-full cursor-pointer shadow-lg"
        >
          Visualizar
        </button>
      </div>
    </div>
  )
}
