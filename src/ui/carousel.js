import { campaigns } from '../data/house.js'
import { icon } from './icons.js'

export function mountCarousel(root, showProduct) {
  let current = 0
  let start = null
  let dragged = false
  root.innerHTML = `<div class="hero-image" aria-hidden="true"></div>
    <div class="hero-stage"></div><div class="hero-controls">
      <div class="dots" aria-label="Escolher campanha">${campaigns
        .map(
          (_, i) =>
            `<button data-slide="${i}" aria-label="Ir para campanha ${i + 1}"><span></span></button>`,
        )
        .join('')}</div>
      <div class="arrows"><button data-step="-1" aria-label="Campanha anterior">${icon('left', 17)}</button><button data-step="1" aria-label="Próxima campanha">${icon('right', 17)}</button></div>
    </div>`
  function render() {
    const s = campaigns[current]
    root.querySelector('.hero-image').style.backgroundImage = `url("${s.background}")`
    root.querySelector('.hero-stage').innerHTML =
      `<img class="hero-object" src="${s.foreground}" fetchpriority="high" alt="" draggable="false">
      <div class="hero-copy"><div class="eyebrow"><i></i>${s.label}</div>
        <h1>${s.title} <em>${s.accent}</em></h1><p>${s.copy}</p>
        <button class="hero-cta">${s.cta}</button></div>`
    root
      .querySelectorAll('[data-slide]')
      .forEach((dot, i) => dot.setAttribute('aria-pressed', i === current))
  }
  function go(index) {
    current = (index + campaigns.length) % campaigns.length
    render()
  }
  root.addEventListener('click', (e) => {
    if (dragged) {
      dragged = false
      return
    }
    const button = e.target.closest('button')
    if (!button) return
    if ('slide' in button.dataset) go(Number(button.dataset.slide))
    else if ('step' in button.dataset) go(current + Number(button.dataset.step))
    else if (button.matches('.hero-cta')) showProduct(campaigns[current].item, button)
  })
  root.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || e.button !== 0) return
    start = { x: e.clientX, y: e.clientY, id: e.pointerId }
    dragged = false
  })
  root.addEventListener('pointermove', (e) => {
    if (!start || e.pointerId !== start.id) return
    if (
      Math.abs(e.clientX - start.x) > 12 &&
      Math.abs(e.clientY - start.y) < Math.abs(e.clientX - start.x)
    )
      root.setPointerCapture(e.pointerId)
  })
  root.addEventListener('pointerup', (e) => {
    if (!start || e.pointerId !== start.id) return
    const dx = e.clientX - start.x
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      dragged = true
      go(current + (dx < 0 ? 1 : -1))
    }
    start = null
  })
  root.addEventListener('pointercancel', () => {
    start = null
  })
  render()
}
