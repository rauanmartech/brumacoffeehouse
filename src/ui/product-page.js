import { byId } from '../lib/catalog.js'
import { productDetails } from './views.js'

export function mountProductPage() {
  const catalog = document.querySelector('#catalog-page')
  const layer = document.querySelector('#product-layer')
  const page = document.querySelector('#product-page')
  const content = document.querySelector('#product-content')
  const back = document.querySelector('#product-back')
  const catalogTitle = document.title
  let opener
  let leaving = false

  async function syncPage() {
    const product = byId.get(location.hash.match(/^#produto\/([\w-]+)$/)?.[1])
    if (product) {
      leaving = false
      content.innerHTML = productDetails(product)
      layer.hidden = false
      catalog.inert = true
      document.body.classList.add('viewing-product')
      document.title = `${product.name} · ${catalogTitle}`
      page.querySelector('.product-scroll').scrollTop = 0
      // Mede a posição inicial para a transição começar abaixo da viewport.
      page.getBoundingClientRect()
      layer.classList.add('active')
      document.querySelector('#product-title').focus({ preventScroll: true })
      return
    }
    if (layer.hidden) return
    leaving = true
    layer.classList.remove('active')
    await Promise.allSettled(page.getAnimations().map((animation) => animation.finished))
    if (layer.classList.contains('active')) return
    layer.hidden = true
    catalog.inert = false
    document.body.classList.remove('viewing-product')
    document.title = catalogTitle
    content.replaceChildren()
    ;(opener?.isConnected ? opener : document.querySelector('#catalogo')).focus({
      preventScroll: true,
    })
    leaving = false
  }

  function goBack() {
    if (layer.hidden || leaving) return
    leaving = true
    if (history.state?.brumaProduct) history.back()
    else {
      history.replaceState(history.state, '', location.pathname + location.search)
      syncPage()
    }
  }
  back.addEventListener('click', goBack)
  layer.addEventListener('click', (event) => {
    if (event.target === layer) goBack()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !layer.hidden) {
      event.preventDefault()
      goBack()
    }
  })
  window.addEventListener('hashchange', syncPage)
  syncPage()
  return (id, trigger) => {
    opener = trigger
    history.pushState({ brumaProduct: true }, '', `#produto/${id}`)
    syncPage()
  }
}
