import { categories, products } from '../data/menu.js'

export const money = (cents) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const normalize = (value) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR').trim()
export const byId = new Map(products.map((p) => [p.id, p]))
const index = products.map((product) => ({
  product,
  text: normalize(
    [
      product.name,
      product.description,
      ...product.ingredients,
      categories.find((c) => c.id === product.category).name,
    ].join(' '),
  ),
}))
export function searchProducts(query) {
  const words = normalize(query).split(/\s+/)
  return index
    .filter((row) => words.every((word) => row.text.includes(word)))
    .map((row) => row.product)
}
