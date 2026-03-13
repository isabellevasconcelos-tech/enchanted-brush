// Aurora - Respostas pre-definidas com deteccao de intencao por palavras-chave
// Sem dependencia de API externa. Funciona offline e 100% gratis.

const GREETINGS = [
  'Saudacoes, nobre viajante! Em que posso iluminar vosso caminho pelo atelier encantado?',
  'Bem-vindo(a) ao reino das pinceladas magicas! Como posso te ajudar, querido(a) visitante?',
  'Que os ventos magicos te tragam sorte! Diga-me, como posso servir-te nesta jornada?',
]

const FALLBACK = [
  'Perdoe-me, nobre viajante, mas essa questao vai alem dos meus encantamentos. Talvez nosso mestre artesao possa te ajudar pelo WhatsApp: (51) 99377-7539!',
  'Oh, que misterio encantador! Nao tenho a resposta em meus pergaminhos, mas nosso WhatsApp (51) 99377-7539 certamente tera!',
  'Pelos reinos encantados, essa pergunta e um enigma para mim! Fale com a loja pelo WhatsApp (51) 99377-7539 para uma resposta magica.',
]

// Intent patterns: [keywords[], response, action?]
const INTENTS = [
  // Navigation intents
  {
    keywords: ['loja', 'shop', 'catalogo', 'ver camisa', 'ver produto', 'mostrar camisa', 'mostrar produto', 'comprar'],
    response: 'Com toda a graca, vou te levar ao nosso salao de pecas encantadas!',
    action: { type: 'navigate', path: '/shop' },
  },
  {
    keywords: ['personalizar', 'customizar', 'chat', 'descrever camisa', 'ia', 'inteligencia'],
    response: 'Ah, que maravilha! Vou te levar ao pergaminho magico onde voce descreve a camisa dos seus sonhos!',
    action: { type: 'navigate', path: '/personalizar' },
  },
  {
    keywords: ['criar camisa', 'editor', 'montar', 'design', 'desenhar', 'visual', 'arrastar'],
    response: 'Que aventura criativa! Vou te levar ao atelier visual onde voce monta sua propria camisa com as maos!',
    action: { type: 'navigate', path: '/criar-camisa' },
  },
  {
    keywords: ['carrinho', 'sacola', 'meu pedido', 'meus itens'],
    response: 'Vou abrir seu bau de tesouros para voce conferir!',
    action: { type: 'navigate', path: '/carrinho' },
  },
  {
    keywords: ['finalizar', 'checkout', 'pagar', 'pagamento', 'fechar pedido'],
    response: 'Hora de selar o pergaminho real! Vou te levar para finalizar seu pedido encantado.',
    action: { type: 'navigate', path: '/checkout' },
  },
  {
    keywords: ['perfil', 'meus dados', 'meu nome', 'endereco', 'minha conta'],
    response: 'Vou te guiar ate o salao dos registros reais, onde seus dados estao guardados!',
    action: { type: 'navigate', path: '/perfil' },
  },
  {
    keywords: ['inspirac', 'referencia', 'ideia', 'buscar imagem'],
    response: 'Que os ventos da criatividade te guiem! Vou te levar ao jardim das inspiracoes.',
    action: { type: 'navigate', path: '/inspiracoes' },
  },
  {
    keywords: ['historia', 'story', 'sobre', 'quem', 'atelier', 'isa lopes', 'origem'],
    response: 'Ah, quer conhecer a lenda por tras do atelier? Venha, vou abrir o pergaminho ancestral!',
    action: { type: 'navigate', path: '/my-story' },
  },
  {
    keywords: ['estrela', 'star', 'escondid', 'jogo', 'segredo', 'missao'],
    response: 'Shhh... voce descobriu o segredo das estrelas! Vou te levar a missao secreta. Ha 7 estrelas escondidas pelo site, e ao encontrar todas, um cupom magico de 5% sera seu!',
    action: { type: 'navigate', path: '/hidden-stars' },
  },
  {
    keywords: ['limitad', 'exclusiv', 'especial', 'rara', 'unica'],
    response: 'As pecas mais raras do reino te aguardam! Vou te levar ao salao das edicoes limitadas.',
    action: { type: 'navigate', path: '/limited' },
  },
  {
    keywords: ['inicio', 'home', 'comeco', 'pagina inicial', 'menu'],
    response: 'Vou te guiar de volta ao portal principal do atelier encantado!',
    action: { type: 'navigate', path: '/' },
  },

  // Product info intents
  {
    keywords: ['produto', 'camisa', 'quais', 'tem', 'disponivel', 'estoque', 'opcoes'],
    response: null, // Will be filled dynamically
    action: { type: 'search_products' },
  },

  // Cart intents
  {
    keywords: ['adicionar', 'colocar', 'quero', 'add'],
    response: null,
    action: { type: 'add_to_cart' },
  },
  {
    keywords: ['o que tem no carrinho', 'ver carrinho', 'meu carrinho', 'quanto ta', 'total'],
    response: null,
    action: { type: 'get_cart' },
  },

  // WhatsApp
  {
    keywords: ['whatsapp', 'zap', 'telefone', 'ligar', 'contato', 'falar com'],
    response: 'Nosso pombo correio magico esta pronto! O WhatsApp da loja e (51) 99377-7539. Vou abrir para voce!',
    action: { type: 'open_whatsapp' },
  },

  // Info intents (no action, just respond)
  {
    keywords: ['preco', 'valor', 'custo', 'quanto custa', 'caro'],
    response: 'Cada peca do atelier e pintada a mao com amor! Os precos variam conforme a arte. Visite nossa loja para ver os valores, ou fale conosco pelo WhatsApp (51) 99377-7539!',
    action: { type: 'navigate', path: '/shop' },
  },
  {
    keywords: ['tamanho', 'medida', 'numero', 'size'],
    response: 'Nossos mantos encantados vem nos tamanhos P, M, G e GG! E temos duas modelagens: Slim e Baby Look (esta com um acrescimo de R$20, pela magia extra do corte).',
  },
  {
    keywords: ['pagamento', 'pix', 'cartao', 'credito', 'debito', 'parcela'],
    response: 'Aceitamos PIX (o feitico mais rapido!), cartao de credito em ate 3x sem juros, e debito. Tudo para facilitar sua jornada!',
  },
  {
    keywords: ['frete', 'entrega', 'envio', 'correio', 'chegar'],
    response: 'Temos uma bencao especial: frete gratis na primeira compra para o Rio Grande do Sul! Para outros reinos, consulte pelo WhatsApp (51) 99377-7539.',
  },
  {
    keywords: ['cupom', 'desconto', 'promocao', 'oferta'],
    response: 'Ha um segredo magico no site... 7 estrelas estao escondidas pelas paginas! Encontre todas e ganhe o cupom STARCOLLECTOR5 com 5% de desconto!',
    action: { type: 'navigate', path: '/hidden-stars' },
  },
  {
    keywords: ['obrigad', 'valeu', 'thanks', 'agradec'],
    response: 'Que as estrelas iluminem seu caminho, querido(a) visitante! Foi uma honra servir-te. Volte sempre ao nosso atelier encantado!',
  },
  {
    keywords: ['oi', 'ola', 'hey', 'eai', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
    response: null, // Will pick from GREETINGS
    action: { type: 'greeting' },
  },
  {
    keywords: ['tchau', 'adeus', 'bye', 'ate mais', 'ate logo', 'flw'],
    response: 'Que os ventos magicos te guiem em seguranca, nobre viajante! Volte sempre ao Enchanted Brush Atelier. Ate a proxima aventura!',
  },
]

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function findIntent(text) {
  const normalized = normalize(text)

  // Check each intent - longer keyword matches first for specificity
  let bestMatch = null
  let bestScore = 0

  for (const intent of INTENTS) {
    let score = 0
    for (const keyword of intent.keywords) {
      const normalizedKeyword = normalize(keyword)
      if (normalized.includes(normalizedKeyword)) {
        // Longer keyword matches score higher
        score += normalizedKeyword.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = intent
    }
  }

  return bestMatch
}

export function processMessage(text) {
  const intent = findIntent(text)

  if (!intent) {
    return {
      response: FALLBACK[Math.floor(Math.random() * FALLBACK.length)],
      action: null,
    }
  }

  // Special case: greeting
  if (intent.action?.type === 'greeting') {
    return {
      response: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
      action: null,
    }
  }

  return {
    response: intent.response,
    action: intent.action || null,
  }
}
