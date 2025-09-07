export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!root.getAttribute('data-theme')) {
    root.setAttribute('data-theme', 'cupcake')
  }
})
