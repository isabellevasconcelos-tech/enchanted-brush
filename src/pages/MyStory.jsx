import { Link } from 'react-router-dom'
import FloralDivider from '../components/FloralDivider'
import HiddenStar from '../components/HiddenStar'

const CHAPTERS = [
  {
    num: 1,
    subtitle: 'O Começo',
    title: 'Onde as Cores Nasceram',
    text: 'Desde muito pequena, Isa Lopes descobriu que o mundo tinha cores que só ela conseguia enxergar de um jeito especial. Entre lápis, tintas e tecidos, ela passava horas explorando formas, texturas e sonhos. Foi nesse universo mágico que sua paixão por artes manuais nasceu, e sua história com a arte começou.',
  },
  {
    num: 2,
    subtitle: 'O Despertar',
    title: 'Um Talento Revelado',
    text: 'Em 2025, Isa percebeu que a pintura não era apenas um hobby, mas um talento capaz de transformar simples camisas em pequenas obras de arte. Cada pincelada era como um toque de magia, e cada cor, uma história esperando para ser contada.',
  },
  {
    num: 3,
    subtitle: 'O Nascimento',
    title: 'Aurora Nasce',
    text: 'Foi assim que Aurora nasceu. Não como uma pessoa, mas como a essência artística que habita cada peça do ateliê. Aurora é a guardiã da arte, mantendo seu mistério e permitindo que a beleza das camisas fale por si mesma. Isa Lopes se tornou, através de Aurora, a criadora de algo que transcende o comum.',
  },
  {
    num: 4,
    subtitle: 'O Ateliê',
    title: 'Enchanted Brush Atelier',
    text: 'O Enchanted Brush Atelier é o lugar onde magia e arte se encontram. Cada camisa é única, pintada à mão, com detalhes que capturam cuidado, paciência e criatividade. Quem veste uma peça do ateliê não veste apenas uma camisa, mas uma história que só existe para aquele momento e aquela pessoa.',
  },
  {
    num: 5,
    subtitle: 'A Experiência',
    title: 'A Experiência da Arte',
    text: 'Isa Lopes quer que cada visitante do ateliê sinta que entrou em um universo encantado. A cada clique, cada olhar, cada escolha de cor, a magia da criação se revela. Aurora está sempre presente, silenciosa, mas viva em cada pincelada, esperando para transformar o cotidiano em algo extraordinário.',
  },
  {
    num: 6,
    subtitle: 'O Convite',
    title: 'Entre no Universo',
    text: 'Agora, você é convidado a entrar nesse mundo. Acompanhe Aurora e Isa Lopes em cada criação, sinta a magia, descubra cores, histórias e detalhes que só o Enchanted Brush Atelier pode oferecer. Cada peça é um pedacinho de sonho, pronto para ser vivido e vestido por você.',
    finalPhrase: 'Em cada obra de arte que eu crio, uma pequena estrela está escondida… uma assinatura silenciosa do meu pincel.',
    closingLine: 'E essa história é apenas o começo…',
  },
]

export default function MyStory() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Papyrus scroll */}
      <div className="papyrus-scroll">
        {/* Top roll decoration */}
        <div className="papyrus-roll papyrus-roll-top" />

        {/* Content */}
        <div className="papyrus-body">
          {/* Header */}
          <div className="text-center mb-8">
            <svg width="40" height="40" viewBox="0 0 28 28" fill="none" className="mx-auto mb-4 opacity-60">
              <path d="M14 2C14 2 17 7 17 10C17 13 14 16 14 16C14 16 11 13 11 10C11 7 14 2 14 2Z" fill="#8B6914" />
              <path d="M14 16C14 16 19 13 22 13C25 13 26 16 26 16C26 16 23 19 20 19C17 19 14 16 14 16Z" fill="#6B4E1B" />
              <path d="M14 16C14 16 9 13 6 13C3 13 2 16 2 16C2 16 5 19 8 19C11 19 14 16 14 16Z" fill="#8B6914" />
              <path d="M14 16C14 16 17 21 17 24C17 26 14 28 14 28C14 28 11 26 11 24C11 21 14 16 14 16Z" fill="#6B4E1B" />
              <circle cx="14" cy="16" r="3" fill="#C8A84E" />
            </svg>

            <h1 className="papyrus-title">
              Entre Sonhos e Pincéis
            </h1>
            <p className="font-heading text-sm sm:text-base text-amber-700/70 italic mt-1">
              por Isa Lopes
            </p>

            <div className="flex items-center justify-center gap-3 my-4">
              <div className="h-px w-12 bg-amber-800/30" />
              <svg width="12" height="12" viewBox="0 0 8 8" className="text-amber-700/50">
                <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
              </svg>
              <div className="h-px w-12 bg-amber-800/30" />
            </div>

            <p className="papyrus-subtitle">
              Enchanted Brush Atelier
            </p>
          </div>

          {/* Chapters */}
          {CHAPTERS.map((chapter, i) => (
            <div key={chapter.num}>
              {/* Divider between chapters */}
              {i > 0 && (
                <div className="flex items-center justify-center gap-3 my-10">
                  <div className="h-px flex-1 bg-amber-800/20" />
                  <svg width="10" height="10" viewBox="0 0 8 8" className="text-amber-700/40 flex-shrink-0">
                    <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                  </svg>
                  <div className="h-px flex-1 bg-amber-800/20" />
                </div>
              )}

              <div className="mb-2">
                <p className="papyrus-chapter-num">— {chapter.num} —</p>
                <p className="papyrus-chapter-subtitle">{chapter.subtitle}</p>
                <h2 className="papyrus-chapter-title">{chapter.title}</h2>

                <p className="papyrus-text">
                  <span className="papyrus-drop-cap">{chapter.text.charAt(0)}</span>
                  {chapter.text.slice(1)}
                </p>

                {chapter.finalPhrase && (
                  <blockquote className="papyrus-quote">
                    "{chapter.finalPhrase}"
                  </blockquote>
                )}

                {chapter.closingLine && (
                  <p className="papyrus-closing">
                    {chapter.closingLine}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Hidden star */}
          <div className="relative flex justify-center mt-6">
            <HiddenStar id="story-book" />
          </div>

          {/* Final CTA */}
          <div className="text-center mt-10 mb-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-amber-800/30" />
              <svg width="14" height="14" viewBox="0 0 8 8" className="text-amber-700/50">
                <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
              </svg>
              <div className="h-px w-16 bg-amber-800/30" />
            </div>

            <Link
              to="/shop"
              className="inline-block btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-10 py-3.5 rounded-full no-underline shadow-lg transition-all duration-300"
            >
              Explorar a Arte
            </Link>
          </div>
        </div>

        {/* Bottom roll decoration */}
        <div className="papyrus-roll papyrus-roll-bottom" />
      </div>
    </div>
  )
}
