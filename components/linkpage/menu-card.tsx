type MenuCardProps = {
  href: string
  title: string
  subtitle: string
  variant: 'gourmet' | 'rapidas'
  onPointerActivate?: () => void
  onPointerDeactivate?: () => void
  onClick?: () => void
}

export function MenuCard({
  href,
  title,
  subtitle,
  variant,
  onPointerActivate,
  onPointerDeactivate,
  onClick,
}: MenuCardProps) {
  return (
    <a
      className={`menu-card menu-card--${variant}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onPointerActivate}
      onMouseLeave={onPointerDeactivate}
      onFocus={onPointerActivate}
      onBlur={onPointerDeactivate}
      onClick={onClick}
    >
      <span className="shine" />
      <span className="pdf-chip">PDF</span>
      <span className="txt">
        <span className="title">{title}</span>
        <span className="sub">{subtitle}</span>
      </span>
      <span className="chev">&#8250;</span>
    </a>
  )
}
