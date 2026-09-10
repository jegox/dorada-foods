import type { MenuKey } from '@/lib/menu-schedule'

type Photo = {
  src: string
  position: 'p1' | 'p2' | 'p3' | 'p4' | 'p5'
  float: 'f1' | 'f2' | 'f3' | 'f4' | 'f5'
}

const GOURMET_PHOTOS: Photo[] = [
  { src: '/dorada/ing-ajo-albahaca.png', position: 'p1', float: 'f1' },
  { src: '/dorada/ing-tomate.png', position: 'p2', float: 'f2' },
  { src: '/dorada/plato-pasta.png', position: 'p3', float: 'f3' },
  { src: '/dorada/plato-rancheros.png', position: 'p4', float: 'f4' },
  { src: '/dorada/ing-patacones.png', position: 'p5', float: 'f5' },
]

const RAPIDAS_PHOTOS: Photo[] = [
  { src: '/dorada/fr-burger.png', position: 'p1', float: 'f1' },
  { src: '/dorada/fr-asado.png', position: 'p2', float: 'f2' },
  { src: '/dorada/fr-desgranado.png', position: 'p3', float: 'f3' },
  { src: '/dorada/fr-salvajada.png', position: 'p4', float: 'f4' },
  { src: '/dorada/fr-nuggets.png', position: 'p5', float: 'f5' },
]

function PhotoStack({ photos }: { photos: Photo[] }) {
  return (
    <>
      {photos.map((photo) => (
        <figure key={photo.src} className={photo.position}>
          <img src={photo.src} alt="" className={photo.float} loading="lazy" />
        </figure>
      ))}
      <div className="fx-tint" />
    </>
  )
}

export function MenuPhotoLayer({ active }: { active: MenuKey }) {
  return (
    <>
      <div className={`fx fx-gourmet${active === 'gourmet' ? ' is-on' : ''}`} aria-hidden="true">
        <PhotoStack photos={GOURMET_PHOTOS} />
      </div>
      <div className={`fx fx-rapidas${active === 'rapidas' ? ' is-on' : ''}`} aria-hidden="true">
        <PhotoStack photos={RAPIDAS_PHOTOS} />
      </div>
    </>
  )
}
