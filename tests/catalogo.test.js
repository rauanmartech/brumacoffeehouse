import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { categories, products } from '../src/data/menu.js'
import { campaigns, finalPromotion } from '../src/data/house.js'
import { searchProducts } from '../src/lib/catalog.js'
import { totals, orderText, readCart, saveCart } from '../src/lib/cart.js'

test('seis categorias com quatro produtos e fotos exclusivas', () => {
  assert.equal(categories.length, 6)
  for (const c of categories) assert.equal(products.filter((p) => p.category === c.id).length, 4)
  assert.equal(new Set(products.map((p) => p.id)).size, 24)
  assert.equal(new Set(products.map((p) => p.image)).size, 24)
})
test('busca sem distinção de caixa ou acento no nome, categoria, descrição e ingredientes', () => {
  for (const [query, id] of [
    ['LIMAO', 'limonada'],
    ['CAFES', 'mocha'],
    ['crema dourada', 'espresso'],
    ['MACA', 'torta-maca'],
  ])
    assert.ok(searchProducts(query).some((p) => p.id === id))
  assert.deepEqual(searchProducts('produto inexistente'), [])
})
test('carrinho soma centavos, quantidades e gera o resumo', () => {
  assert.deepEqual(totals({}), { quantity: 0, price: 0 })
  const cart = { espresso: 2, cappuccino: 1 }
  assert.deepEqual(totals(cart), { quantity: 3, price: 3270 })
  assert.match(orderText(cart), /2 × Espresso/)
  assert.match(orderText(cart), /32,70/)
})
test('pedido para entrega inclui o endereço e os subtotais', () => {
  const address = {
    street: 'Rua das Flores',
    number: 's/n',
    district: 'Centro',
    city: 'Salvador',
    extra: 'Bloco B',
  }
  const text = orderText({ espresso: 2, cappuccino: 1 }, address)
  assert.match(text, /2 × Espresso .*17,80/)
  assert.match(text, /1 × Cappuccino .*14,90/)
  assert.match(text, /Total dos produtos:.*32,70/)
  assert.ok(
    text.endsWith('Rua das Flores, s/n\nComplemento: Bloco B\nBairro: Centro\nCidade: Salvador'),
  )
  assert.doesNotMatch(orderText({ espresso: 1 }, { ...address, extra: '' }), /Complemento:/)
})
test('persistência descarta dados antigos inválidos', () => {
  const data = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => data.get(key),
      setItem: (key, value) => data.set(key, value),
    },
  })
  try {
    saveCart({ espresso: 2, removido: 5, latte: -1, mocha: 1.5 })
    assert.deepEqual(readCart(), { espresso: 2 })
    data.set('bruma.cart.v1', 'json inválido')
    assert.deepEqual(readCart(), {})
  } finally {
    delete globalThis.localStorage
  }
})
test('todas as fotos referenciadas existem em WebP e cada destaque tem duas camadas', async () => {
  assert.equal(campaigns.length, 4)
  const images = [
    ...products.map((p) => p.image),
    ...campaigns.flatMap((s) => [s.foreground, s.background]),
    finalPromotion.image,
  ]
  assert.equal(new Set(images).size, 33)
  for (const path of images) {
    const file = await readFile(new URL('../public/' + path, import.meta.url))
    assert.equal(file.toString('ascii', 8, 12), 'WEBP', path)
  }
})
