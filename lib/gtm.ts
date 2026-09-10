declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * Pushes an event to the GTM dataLayer. Safe to call unconditionally: it's a
 * no-op during SSR, and if the GTM container script hasn't loaded yet (or
 * NEXT_PUBLIC_GTM_ID is unset), it just initializes the array so nothing
 * throws — GTM drains it once it does load.
 */
export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(data)
}
