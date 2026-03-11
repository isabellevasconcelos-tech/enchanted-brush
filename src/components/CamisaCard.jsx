import { useNavigate } from 'react-router-dom'

export default function CamisaCard({ camisa }) {
  const navigate = useNavigate()

  const precoFormatado = Number(camisa.preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="group bg-cream-50 rounded-2xl overflow-hidden border border-rose-light/30 hover:border-rose-medium/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(200,150,46,0.15)] animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={camisa.imagem_url || 'https://placehold.co/400x400/2E2214/C8962E?text=Arte'}
          alt={camisa.nome}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sparkle decoration */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 8 8"
          className="absolute top-3 right-3 text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-sparkle"
        >
          <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
        </svg>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg text-enchanted mb-1 tracking-wide">
          {camisa.nome}
        </h3>
        <p className="text-enchanted-muted text-sm mb-3 line-clamp-2 leading-relaxed">
          {camisa.descricao}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {camisa.tamanhos?.map((tam) => (
            <span
              key={tam}
              className="bg-blue-pastel/50 text-blue-deep text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-light/50"
            >
              {tam}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-heading text-xl text-rose-accent font-semibold">
            {precoFormatado}
          </span>
          <button
            onClick={() => navigate(`/produto/${camisa.id}`)}
            className="bg-rose-pastel hover:bg-rose-light text-rose-deep px-5 py-2 rounded-full text-sm font-heading tracking-wide cursor-pointer transition-all duration-300 border border-rose-light/50 hover:shadow-md"
          >
            Ver Mais
          </button>
        </div>
      </div>
    </div>
  )
}
