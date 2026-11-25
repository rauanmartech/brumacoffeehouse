export const house = {
  name: 'Bruma',
  subtitle: 'Coffee House',
  about:
    'Na Bruma, o café é um convite para desacelerar. Preparamos cada xícara com grãos de torra média e servimos pães, doces e pequenos pratos para acompanhar a sua pausa.',
  hours: 'Segunda a sexta, das 8h às 18h. Sábados e domingos, das 9h às 17h.',
  address: '',
  mapsUrl: '',
  contact: 'Para falar com a equipe, procure o balcão da cafeteria.',
  instagramUrl: '',
  whatsapp: '5571983789492', // Código do país, DDD e número.
}

export const navigation = [
  ['home', 'home', 'Início'],
  ['menu', 'book', 'Cardápio completo'],
  ['about', 'info', 'Sobre a cafeteria'],
  ['hours', 'clock', 'Horários de funcionamento'],
  ['location', 'pin', 'Localização'],
  ['contact', 'chat', 'Contato'],
  ['instagram', 'camera', 'Instagram'],
]

export const campaigns = [
  {
    label: 'Seleção do barista',
    title: 'Café com',
    accent: 'alma.',
    copy: 'Espresso da casa com leite aveludado e latte art.',
    cta: 'Provar o cappuccino',
    item: 'cappuccino',
  },
  {
    label: 'Da nossa confeitaria',
    title: 'Doce',
    accent: 'encontro.',
    copy: 'Chocolate intenso e um café recém-passado para acompanhar a tarde.',
    cta: 'Conhecer o brownie',
    item: 'brownie',
  },
  {
    label: 'Especial gelado',
    title: 'Pausa',
    accent: 'fresca.',
    copy: 'Espresso, leite e gelo em camadas que se encontram no primeiro gole.',
    cta: 'Provar o iced latte',
    item: 'iced-latte',
  },
  {
    label: 'Bom dia, Bruma',
    title: 'Manhã sem',
    accent: 'pressa.',
    copy: 'Croissant amanteigado e espresso da casa para começar o dia.',
    cta: 'Conhecer o combo',
    item: 'combo-cafe-croissant',
  },
].map((slide, i) => ({
  ...slide,
  background: `images/campanhas/fundo-${i + 1}.webp`,
  foreground: `images/campanhas/destaque-${i + 1}.webp`,
}))

export const finalPromotion = {
  title: 'Uma pausa',
  accent: 'bem gelada.',
  copy: 'Descubra os gelados da Bruma.',
  cta: 'Explorar bebidas',
  category: 'bebidas',
  image: 'images/campanhas/pausa.webp',
}
