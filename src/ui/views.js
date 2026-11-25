import { house, navigation } from '../data/house.js'
import { money } from '../lib/catalog.js'
import { lines, totals } from '../lib/cart.js'
import { icon } from './icons.js'

export const logo = () =>
  `<span class="brand"><img src="./mark.svg" width="36" height="40" alt=""><span><b>${house.name}</b><small>${house.subtitle}</small></span></span>`
const close =
  '<button class="round close" data-close aria-label="Fechar">' + icon('x', 20) + '</button>'
const rating = (p) =>
  `<span class="rating" aria-label="Nota ${p.rating.toFixed(1).replace('.', ',')} de 5, ${p.reviews} avaliações">${icon('star', 15)} <strong>${p.rating.toFixed(1).replace('.', ',')}</strong> <span>(${p.reviews})</span></span>`

export function categorySection(category, items) {
  return `<section class="menu-section" aria-labelledby="title-${category.id}">
    <h3 id="title-${category.id}">${icon(category.icon, 22)}${category.name}</h3>
    <div class="grid">${items.map((p) => productCard(p, 'h4')).join('')}</div>
  </section>`
}

export function productCard(p, heading = 'h3') {
  return `<article class="product-card">
    <button class="product-photo" data-detail="${p.id}" aria-label="Ver detalhes de ${p.name}">
      <img src="${p.image}" width="480" height="340" loading="lazy" decoding="async" alt="${p.name}">
    </button>
    <div class="product-copy">${rating(p)}
      <${heading} class="product-title"><button data-detail="${p.id}">${p.name}</button></${heading}><p>${p.description}</p>
      <details class="ingredients"><summary>Ingredientes</summary><small>${p.ingredients.join(', ')}.</small></details>
      <div class="purchase"><strong>${money(p.price)}</strong><button class="add" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">${icon('plus', 19)}</button></div>
    </div></article>`
}
export function productDetails(p) {
  return `<div class="detail-photo"><img alt="${p.name}" src="${p.image}"></div><div class="detail-copy">
    <div class="detail-meta">${rating(p)}<span>${p.reviews} avaliações</span></div>
    <h1 id="product-title" tabindex="-1">${p.name}</h1><p>${p.description}</p>
    <span class="tag">${p.tags.join(' · ')}</span>
    <h3>Ingredientes</h3><p>${p.ingredients.join(', ')}.</p>
    ${p.allergens.length ? `<h3>Alergênicos</h3><p>Contém ${p.allergens.join(', ').toLowerCase()}.</p>` : ''}
    <button class="solid wide" data-add="${p.id}">${icon('plus', 18)} Adicionar · ${money(p.price)}</button></div>`
}
export function menuView() {
  return `<div class="drawer-head"><h2 id="panel-title">Menu</h2>${close}</div>${logo()}
  <nav class="drawer-nav">${navigation
    .map(
      ([id, sym, label]) =>
        `<button data-nav="${id}">${icon(sym, 21)}<span>${label}</span>${icon('right', 16)}</button>`,
    )
    .join('')}</nav>`
}
export function infoView(id) {
  const options = {
    about: [house.about],
    hours: [house.hours],
    location: [
      house.address || 'O endereço da casa será divulgado aqui.',
      house.mapsUrl,
      'Ver no mapa',
    ],
    contact: [
      house.contact,
      house.whatsapp && `https://wa.me/${house.whatsapp}`,
      'Conversar no WhatsApp',
    ],
    instagram: [
      'O perfil oficial da casa ' +
        (house.instagramUrl ? 'está no Instagram.' : 'será divulgado aqui.'),
      house.instagramUrl,
      'Abrir Instagram',
    ],
  }
  const [copy, url, label] = options[id]
  const [, sym, title] = navigation.find((row) => row[0] === id)
  return `<div class="info-view">${close}<div class="info-icon">${icon(sym, 30)}</div><h2 id="panel-title">${title}</h2>
    <p>${copy}</p>${url ? `<a class="solid" target="_blank" rel="noopener noreferrer" href="${url}">${label}</a>` : ''}
    <button class="text-btn" data-nav="menu">Voltar ao cardápio</button></div>`
}
export function cartView(cart) {
  const total = totals(cart)
  const head = `<div class="drawer-head"><h2 id="panel-title">Meu pedido</h2>${close}</div>`
  if (!total.quantity)
    return `${head}<div class="empty-cart"><span class="info-icon">${icon('bag', 34)}</span><h3>Seu carrinho está vazio</h3><p>Escolha algo do cardápio para começar seu pedido.</p><button class="solid" data-nav="menu">Explorar o cardápio</button></div>`
  return `${head}<p class="cart-count">${total.quantity} ${total.quantity === 1 ? 'item' : 'itens'} no carrinho</p>
    <div class="cart-lines">${lines(cart)
      .map(
        ({ item, qty, subtotal }) => `
      <article class="cart-line"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><small>${money(item.price)} / un.</small>
        <div class="stepper"><button data-delta="-1" data-id="${item.id}" aria-label="Diminuir ${item.name}">${icon('minus', 16)}</button><span>${qty}</span><button data-delta="1" data-id="${item.id}" aria-label="Aumentar ${item.name}" ${qty >= 999 ? 'disabled' : ''}>${icon('plus', 16)}</button></div></div>
        <div class="line-end"><button data-remove="${item.id}" aria-label="Remover ${item.name}">${icon('trash', 17)}</button><b>${money(subtotal)}</b></div></article>`,
      )
      .join('')}</div>
    <div class="cart-total"><div><span>Total do pedido</span><strong>${money(total.price)}</strong></div>
      <button class="solid wide" data-order>${house.whatsapp ? 'Informar endereço de entrega' : 'Copiar pedido'}</button></div>`
}

export function deliveryView(cart) {
  return `<div class="drawer-head"><h2 id="panel-title">Entrega</h2>${close}</div>
    <button class="delivery-back" data-nav="cart">${icon('left', 16)} Voltar ao carrinho</button>
    <form id="delivery-form" class="delivery-form" lang="pt-BR">
      <label>Rua ou avenida<input name="street" autocomplete="address-line1" maxlength="160" required></label>
      <label>Número<input name="number" maxlength="16" required placeholder="Ex.: 24 ou s/n"></label>
      <label>Complemento (opcional)<input name="extra" autocomplete="address-line2" maxlength="120" placeholder="Apto., bloco ou referência"></label>
      <label>Bairro<input name="district" autocomplete="address-level3" maxlength="100" required></label>
      <label>Cidade<input name="city" autocomplete="address-level2" maxlength="100" required></label>
      <div class="cart-total"><div><span>Total dos produtos</span><strong data-delivery-total>${money(totals(cart).price)}</strong></div>
        <button type="submit" class="solid wide">Continuar no WhatsApp</button>
        <p>Confira a mensagem e toque em enviar na conversa com a cafeteria.</p></div>
    </form>`
}
