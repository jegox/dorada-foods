'use client'

import { useEffect, useState } from 'react'

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * True only on devices with real pointer hover (mouse/trackpad), never on
 * touch. Defaults to false during SSR/first paint so server and client
 * output match, then resolves after mount.
 */
export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setHoverCapable(query.matches)

    const onChange = (event: MediaQueryListEvent) => setHoverCapable(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return hoverCapable
}
