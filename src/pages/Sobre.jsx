import FloralDivider from '../components/FloralDivider'
import { Link } from 'react-router-dom'

export default function Sobre() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-enchanted mb-2">
          Sobre a Artista
        </h1>
        <p className="text-enchanted-muted text-sm italic">
          A história por trás de cada pincelada
        </p>
      </div>

      <FloralDivider className="mb-10" />

      {/* Artist Section */}
      <section className="mb-12">
        <div className="md:flex gap-8 items-center">
          <div className="md:w-2/5 mb-6 md:mb-0">
            <div className="rounded-2xl overflow-hidden border-2 border-rose-light/30 shadow-[0_4px_20px_rgba(200,150,46,0.1)]">
              <img
                src="https://placehold.co/400x500/2E2214/C8962E?text=A+Artista"
                alt="A artista"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
          <div className="md:w-3/5">
            <h2 className="font-display text-xl text-enchanted mb-4">
              Uma Jornada de Cores
            </h2>
            <div className="space-y-4 text-enchanted-muted leading-relaxed text-sm">
              <p>
                Desde pequena, sempre fui encantada pelas cores. Lápis, tintas, pincéis — tudo virava ferramenta para transformar o mundo ao meu redor em algo mais bonito e mágico.
              </p>
              <p>
                A ideia de pintar camisas nasceu de um acidente feliz: uma mancha de tinta em uma camiseta branca que se transformou em uma flor. Daquele momento em diante, cada tecido se tornou uma tela em branco esperando por uma história.
              </p>
              <p>
                Hoje, cada peça que crio carrega um pedaço da minha alma. Uso tintas especiais para tecido que resistem a lavagens, garantindo que a arte permaneça viva por muito tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Process Section */}
      <section className="py-12">
        <h2 className="font-display text-2xl text-enchanted text-center mb-8">
          O Processo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Inspiração',
              desc: 'Cada arte nasce de um momento de inspiração — uma flor no jardim, um pôr do sol, um sonho. A ideia ganha forma no papel antes de tocar o tecido.',
              color: 'rose',
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-rose-medium">
                  <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" fill="currentColor" />
                  <path d="M12 12C12 12 16 10 18 10C20 10 22 12 22 12C22 12 20 14 18 14C16 14 12 12 12 12Z" fill="currentColor" />
                  <path d="M12 12C12 12 8 10 6 10C4 10 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z" fill="currentColor" />
                  <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="#FCD34D" />
                </svg>
              ),
            },
            {
              step: '2',
              title: 'Criação',
              desc: 'Com pincéis delicados e tintas especiais para tecido, a arte ganha vida pincelada por pincelada. Cada detalhe é feito à mão com cuidado e amor.',
              color: 'blue',
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-blue-medium">
                  <path d="M24 3L28 7L14 21H10V17L24 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 29C6 29 6 23 12 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              step: '3',
              title: 'Magia',
              desc: 'Após a secagem e fixação térmica, a arte se torna parte do tecido. A camisa está pronta para levar um pedaço de magia para o mundo.',
              color: 'gold',
              icon: (
                <svg width="32" height="32" viewBox="0 0 8 8" className="text-gold-accent">
                  <path d="M4 0.5L5.1 2.8L7.6 3.1L5.8 4.8L6.2 7.3L4 6.1L1.8 7.3L2.2 4.8L0.4 3.1L2.9 2.8Z" fill="currentColor" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`text-center p-6 rounded-2xl border border-${item.color}-light/30 bg-${item.color}-pastel/20`}
            >
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-heading text-lg text-enchanted mb-2">
                {item.title}
              </h3>
              <p className="text-enchanted-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <FloralDivider />

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="font-display text-xl text-enchanted mb-3">
          Quer uma peça exclusiva?
        </h2>
        <p className="text-enchanted-muted text-sm mb-6 italic">
          Conte-me sua ideia e juntos criaremos algo mágico
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/loja"
            className="inline-block bg-rose-pastel hover:bg-rose-light text-rose-deep font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline border border-rose-light/50 transition-all duration-300"
          >
            Ver Coleção
          </Link>
          <Link
            to="/encomenda"
            className="inline-block btn-enchanted text-white font-heading text-sm uppercase tracking-widest px-8 py-3 rounded-full no-underline shadow-lg transition-all duration-300"
          >
            Fazer Encomenda
          </Link>
        </div>
      </section>
    </div>
  )
}
