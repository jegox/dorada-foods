import type { ReactNode } from 'react'

type SocialRowProps = {
  href: string
  name: string
  description: string
  badgeClassName: string
  badgeContent: ReactNode
  onClick?: () => void
}

export function SocialRow({
  href,
  name,
  description,
  badgeClassName,
  badgeContent,
  onClick,
}: SocialRowProps) {
  return (
    <a className="social" href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      <span className={`badge ${badgeClassName}`}>{badgeContent}</span>
      <span className="txt">
        <span className="name">{name}</span>
        <span className="desc">{description}</span>
      </span>
      <span className="chev">&#8250;</span>
    </a>
  )
}
