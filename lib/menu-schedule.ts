export type MenuKey = 'gourmet' | 'rapidas' | null

const RESTAURANT_TIMEZONE = 'America/Bogota'

/**
 * Maps the current hour in Colombia local time to which menu's photo
 * layer should show on devices without real hover:
 * 06:00–15:59 -> gourmet/almuerzos, 16:00–22:59 -> rapidas, else -> none.
 */
export function resolveScheduledMenu(date: Date = new Date()): MenuKey {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: RESTAURANT_TIMEZONE,
      hour: 'numeric',
      hour12: false,
    }).format(date),
  )

  if (hour >= 6 && hour < 16) return 'gourmet'
  if (hour >= 16 && hour < 23) return 'rapidas'
  return null
}
