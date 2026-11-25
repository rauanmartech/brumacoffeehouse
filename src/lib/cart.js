import { byId, money } from './catalog.js'
import { house } from '../data/house.js'

const key = 'bruma.cart.v1'
export function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}')
    return Object.fromEntries(
      Object.entries(saved).filter(
        ([id, n]) => byId.has(id) && Number.isSafeInteger(n) && n > 0 && n <= 999,
      ),
    )
  } catch {
    return {}
  }
}
export function saveCart(cart) {
  try {
    localStorage.setItem(key, JSON.stringify(cart))
  } catch {
    /* O pedido segue disponível nesta sessão. */
  }
}
export function lines(cart) {
  return Object.entries(cart).map(([id, qty]) => {
    const item = byId.get(id)
    return { item, qty, subtotal: item.price * qty }
  })
}
export function totals(cart) {
  return lines(cart).reduce(
    (sum, line) => ({
      quantity: sum.quantity + line.qty,
      price: sum.price + line.subtotal,
    }),
    { quantity: 0, price: 0 },
  )
}
export function orderText(cart, address) {
  const message = [
    `Olá, ${house.name}! Gostaria de fazer um pedido${address ? ' para entrega' : ''}.`,
    '',
    '*Itens do pedido*',
    ...lines(cart).map(
      ({ item, qty, subtotal }) =>
        `• ${qty} × ${item.name} (${money(item.price)} cada) — ${money(subtotal)}`,
    ),
    '',
    `*Total dos produtos:* ${money(totals(cart).price)}`,
  ]
  if (address) {
    message.push('', '*Endereço de entrega*', `${address.street}, ${address.number}`)
    if (address.extra) message.push(`Complemento: ${address.extra}`)
    message.push(`Bairro: ${address.district}`, `Cidade: ${address.city}`)
  }
  return message.join('\n')
}
