import './styles/base.css'
import './styles/menu.css'
import './styles/dialog.css'
import './styles/product-page.css'
import { categories, products } from './data/menu.js'
import { house, finalPromotion } from './data/house.js'
import { byId, money, searchProducts } from './lib/catalog.js'
import { readCart, saveCart, totals, orderText } from './lib/cart.js'
import { icon } from './ui/icons.js'
import {
  productCard,
  categorySection,
  cartView,
  deliveryView,
  menuView,
  infoView,
} from './ui/views.js'
import { mountCarousel } from './ui/carousel.js'
import { mountProductPage } from './ui/product-page.js'

const $ = (selector) => document.querySelector(selector)
const search = $('#search')
const panel = $('#panel')
const panelBody = $('#panel-body')
let selected = categories[0].id
let cart = readCart()
let deliveryDraft = {}
let panelType = ''
let closeTimer
let toastTimer
let afterClose
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollToCatalog = () =>
  $('#categories').scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' })

document.querySelectorAll('[data-icon]').forEach((el) => {
  el.innerHTML = icon(el.dataset.icon)
})
$('.mast .brand b').textContent = house.name
$('.mast .brand small').textContent = house.subtitle
$('.mast .brand').setAttribute('aria-label', house.name + ' ' + house.subtitle + ', início')
$('.site-footer span').textContent = house.name + ' ' + house.subtitle
const p = finalPromotion
$('#promotion').style.backgroundImage = `url("${p.image}")`
$('#promotion').innerHTML =
  `<h2>${p.title} <em>${p.accent}</em></h2><p>${p.copy}</p><button class="promo-link" data-category="${p.category}">${p.cta}</button>`
$('#categories').innerHTML = categories
  .map((c) => `<button data-category="${c.id}">${icon(c.icon, 24)}<span>${c.name}</span></button>`)
  .join('')

function renderCatalog() {
  const query = search.value.trim()
  const category = categories.find((c) => c.id === selected)
  const complete = !query && selected === null
  const items = query
    ? searchProducts(query)
    : complete
      ? products
      : products.filter((p) => p.category === selected)
  $('#clear').hidden = !search.value
  $('#hero').hidden = !!query
  $('#promotion').hidden = !!query
  $('#category-title').textContent = query
    ? 'Resultados da busca'
    : complete
      ? 'Cardápio completo'
      : category.name
  $('#result-count').textContent = items.length + (items.length === 1 ? ' opção' : ' opções')
  const list = $('#products')
  list.className = complete ? 'menu-sections' : 'grid'
  if (complete) {
    list.innerHTML = categories
      .map((c) =>
        categorySection(
          c,
          items.filter((p) => p.category === c.id),
        ),
      )
      .join('')
  } else {
    list.innerHTML = items.length
      ? items.map((p) => productCard(p)).join('')
      : `<div class="empty-search">${icon('search', 28)}<h3>Nenhum produto encontrado</h3><p>Tente outro ingrediente ou nome de produto.</p><button class="text-btn" data-reset>Limpar busca</button></div>`
  }
  $('#categories')
    .querySelectorAll('button')
    .forEach((b) => b.setAttribute('aria-pressed', !query && b.dataset.category === selected))
}
function choose(id, scroll = false) {
  selected = id
  search.value = ''
  renderCatalog()
  if (scroll) scrollToCatalog()
}
function count() {
  const { quantity } = totals(cart)
  document.querySelectorAll('[data-count]').forEach((el) => {
    el.textContent = quantity
  })
  $('#open-cart').setAttribute('aria-label', `Abrir carrinho, ${quantity} itens`)
}
function toast(message) {
  clearTimeout(toastTimer)
  $('#toast').textContent = message
  $('#toast').classList.add('visible')
  if (panel.open) panel.append($('#toast'))
  else document.body.append($('#toast'))
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2100)
}
function show(type, content) {
  clearTimeout(closeTimer)
  afterClose = null
  panelType = type
  panel.className = type === 'delivery' ? 'cart delivery' : type
  panelBody.innerHTML = content
  if (!panel.open) {
    panel.showModal()
    document.body.classList.add('locked')
  }
  panel.scrollTop = 0
  panel.querySelector('[data-close]')?.focus({ preventScroll: true })
}
function closePanel(done) {
  afterClose = done
  if (!panel.open) {
    done?.()
    return
  }
  clearTimeout(closeTimer)
  panel.classList.add('closing')
  closeTimer = setTimeout(() => panel.close(), reduced() ? 0 : 160)
}
panel.addEventListener('cancel', (e) => {
  e.preventDefault()
  closePanel()
})
panel.addEventListener('click', (e) => {
  if (e.target === panel && !panelBody.contains(e.target)) {
    const r = panel.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX >= r.right || e.clientY < r.top || e.clientY >= r.bottom)
      closePanel()
  }
})
panel.addEventListener('close', () => {
  document.body.classList.remove('locked')
  panelType = ''
  document.body.append($('#toast'))
  afterClose?.()
  afterClose = null
})
function adjust(id, delta, remove = false) {
  if (!byId.has(id)) return
  const next = remove ? 0 : Math.min(999, Math.max(0, (cart[id] || 0) + delta))
  if (next) cart[id] = next
  else delete cart[id]
  saveCart(cart)
  count()
  if (panelType === 'cart') {
    const focusKey = document.activeElement?.dataset
    const previous = focusKey?.delta
      ? `[data-id="${id}"][data-delta="${focusKey.delta}"]`
      : `[data-remove="${id}"]`
    panelBody.innerHTML = cartView(cart)
    ;(panelBody.querySelector(previous) || panelBody.querySelector('[data-close]')).focus({
      preventScroll: true,
    })
  } else toast(`${byId.get(id).name} no carrinho · ${next} un.`)
}
function navigate(id) {
  if (id === 'cart') return show('cart', cartView(cart))
  if (id === 'home' || id === 'menu') {
    closePanel(() => {
      if (id === 'home') {
        choose(categories[0].id)
        window.scrollTo({ top: 0, behavior: reduced() ? 'instant' : 'smooth' })
      } else {
        selected = null
        search.value = ''
        renderCatalog()
        scrollToCatalog()
        $('#catalogo').focus({ preventScroll: true })
      }
    })
    return
  }
  show('info', infoView(id))
}
async function checkout() {
  if (house.whatsapp) {
    show('delivery', deliveryView(cart))
    const form = $('#delivery-form')
    for (const [name, value] of Object.entries(deliveryDraft)) form.elements[name].value = value
    form.oninput = () => {
      deliveryDraft = Object.fromEntries(new FormData(form))
    }
    form.onsubmit = (event) => {
      event.preventDefault()
      for (const input of form.querySelectorAll('input')) input.value = input.value.trim()
      if (!form.reportValidity()) return
      if (!totals(cart).quantity) return navigate('cart')
      deliveryDraft = Object.fromEntries(new FormData(form))
      const text = orderText(cart, deliveryDraft)
      window.open(
        `https://wa.me/${house.whatsapp}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener,noreferrer',
      )
    }
    return
  }
  const text = orderText(cart)
  try {
    await navigator.clipboard.writeText(text)
    toast('Pedido copiado')
  } catch {
    const row = document.createElement('div')
    row.innerHTML =
      '<label class="copy-label">Selecione e copie seu pedido<textarea readonly></textarea></label>'
    panelBody.querySelector('.copy-label')?.remove()
    panelBody.append(row)
    row.querySelector('textarea').value = text
    row.querySelector('textarea').select()
  }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  const d = b.dataset
  if ('nav' in d) navigate(d.nav)
  else if ('category' in d) choose(d.category, !!b.closest('#promotion'))
  else if ('detail' in d) openProduct(d.detail, b)
  else if ('add' in d) adjust(d.add, 1)
  else if ('remove' in d) adjust(d.remove, 0, true)
  else if ('delta' in d) adjust(d.id, Number(d.delta))
  else if ('close' in d) closePanel()
  else if ('order' in d) checkout()
  else if (b.id === 'open-menu') show('side-menu', menuView())
  else if (b.id === 'open-cart') navigate('cart')
  else if (b.id === 'clear' || 'reset' in d) {
    search.value = ''
    renderCatalog()
    search.focus()
  }
})
$('.mast .brand').addEventListener('click', (e) => {
  e.preventDefault()
  navigate('home')
})
$('#search-form').addEventListener('submit', (e) => {
  e.preventDefault()
  search.blur()
  scrollToCatalog()
})
search.addEventListener('input', renderCatalog)
window.addEventListener('storage', (e) => {
  if (e.key === 'bruma.cart.v1' || e.key === null) {
    cart = readCart()
    count()
    if (panelType === 'cart') panelBody.innerHTML = cartView(cart)
    if (panelType === 'delivery') {
      const total = totals(cart)
      if (total.quantity) $('[data-delivery-total]').textContent = money(total.price)
      else navigate('cart')
    }
  }
})
renderCatalog()
count()
const openProduct = mountProductPage()
mountCarousel($('#hero'), openProduct)
