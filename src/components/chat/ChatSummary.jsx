export default function ChatSummary({ formData, profile }) {
  return (
    <div className="bg-cream-50 rounded-2xl border border-rose-light/30 p-4 animate-chat-in">
      <p className="text-[10px] font-heading text-rose-accent uppercase tracking-widest mb-3">
        Enchanted Brush
      </p>
      <p className="text-sm font-body text-enchanted mb-3">
        Aqui esta o resumo do seu pedido personalizado:
      </p>

      {/* Image preview */}
      {formData.imagemUrl && (
        <div className="mb-3">
          <img
            src={formData.imagemUrl}
            alt="Referência"
            className="w-full max-h-52 object-cover rounded-xl border border-rose-light/20"
          />
          <p className="text-[10px] text-enchanted-muted mt-1 italic">
            {formData.imagemTipo === 'upload' ? 'Foto enviada' : formData.imagemTipo === 'catalogo' ? 'Do nosso catalogo' : 'Inspiracao Pixabay'}
          </p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-heading text-enchanted min-w-[90px]">Estilo:</span>
          <span className="text-enchanted-muted">{formData.estiloTema}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-heading text-enchanted min-w-[90px]">Cores:</span>
          <span className="text-enchanted-muted">{formData.cores}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-heading text-enchanted min-w-[90px]">Tamanho:</span>
          <span className="text-enchanted-muted">{formData.tamanho}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-heading text-enchanted min-w-[90px]">Modelagem:</span>
          <span className="text-enchanted-muted">{formData.modelagem === 'babylook' ? 'Baby Look' : 'Slim'}</span>
        </div>
        {formData.observacoes && (
          <div className="flex gap-2">
            <span className="font-heading text-enchanted min-w-[90px]">Detalhes:</span>
            <span className="text-enchanted-muted">{formData.observacoes}</span>
          </div>
        )}
      </div>

      {/* Customer info */}
      <div className="border-t border-rose-light/20 mt-3 pt-3 space-y-1 text-sm">
        <p className="font-heading text-[10px] text-enchanted uppercase tracking-widest mb-1.5">Seus Dados</p>
        <p className="text-enchanted-muted"><span className="font-heading text-enchanted">Nome:</span> {profile.nome}</p>
        <p className="text-enchanted-muted"><span className="font-heading text-enchanted">WhatsApp:</span> {profile.whatsapp}</p>
        {profile.email && <p className="text-enchanted-muted"><span className="font-heading text-enchanted">E-mail:</span> {profile.email}</p>}
      </div>
    </div>
  )
}
