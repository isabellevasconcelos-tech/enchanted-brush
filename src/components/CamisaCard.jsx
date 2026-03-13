import { useNavigate } from 'react-router-dom'

export default function CamisaCard({ camisa }) {
  const navigate = useNavigate()

  const precoFormatado = Number(camisa.preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="group rounded-2xl overflow-hidden border border-gold-accent/20 transition-all duration-500 hover:border-gold-accent/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] animate-fade-in" style={{ background: 'linear-gradient(145deg, #352418, #3D2B1C)' }}>
      {/* Área da imagem com cabide e fundo caramelo */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #4A3525, #3D2B1C)' }}>
        {/* Cabide SVG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <svg width="80" height="32" viewBox="0 0 80 32" fill="none">
            {/* Gancho */}
            <path d="M40 0 C40 0, 42 4, 42 6 C42 8, 40 10, 40 10" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="0" r="2" fill="#D4AF37" opacity="0.6" />
            {/* Barra do cabide */}
            <path d="M10 20 Q15 10, 40 10 Q65 10, 70 20" stroke="#B8962A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M10 20 Q15 10, 40 10 Q65 10, 70 20" stroke="#D4AF37" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
            {/* Pontas */}
            <circle cx="10" cy="20" r="2" fill="#B8962A" />
            <circle cx="70" cy="20" r="2" fill="#B8962A" />
          </svg>
        </div>

        {/* Imagem da camisa */}
        <img
          src={camisa.imagem_url || 'https://placehold.co/400x400/352418/D4AF37?text=Arte'}
          alt={camisa.nome}
          onClick={() => navigate(`/produto/${camisa.id}`)}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
          style={{ paddingTop: '12px' }}
        />

        {/* Overlay gradiente caramelo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#352418] via-transparent to-[#4A3525]/30 pointer-events-none" />

        {/* Sombra da camisa (como se estivesse pendurada) */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-4 bg-[radial-gradient(ellipse,rgba(0,0,0,0.3),transparent)] pointer-events-none" />

        {/* Sparkle dourado */}
        <span className="brand-sparkle absolute" style={{ top: '12px', right: '12px', '--s-color': '#D4AF37', '--s-size': '2px', '--s-speed': '2s', '--s-delay': '0.3s' }} />
      </div>

      {/* Info */}
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
              className="bg-gold-pastel/40 text-gold-accent text-xs font-medium px-2.5 py-0.5 rounded-full border border-gold-accent/20"
            >
              {tam}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-heading text-xl text-gold-accent font-semibold">
            {precoFormatado}
          </span>
          <button
            onClick={() => navigate(`/produto/${camisa.id}`)}
            className="btn-enchanted text-white px-5 py-2 rounded-full text-sm font-heading tracking-wide cursor-pointer transition-all duration-300 border-none shadow-md"
          >
            Ver Mais
          </button>
        </div>
      </div>
    </div>
  )
}
