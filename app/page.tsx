"use client";

import { useEffect, useState } from "react";
import { useHoverCapable } from "@/hooks/use-hover-capable";
import { resolveScheduledMenu, type MenuKey } from "@/lib/menu-schedule";
import { pushToDataLayer } from "@/lib/gtm";
import { AmbientBackground } from "@/components/linkpage/ambient-background";
import { MenuPhotoLayer } from "@/components/linkpage/menu-photo-layer";
import { MenuCard } from "@/components/linkpage/menu-card";
import { SocialRow } from "@/components/linkpage/social-row";

const version = Date.now();

const GOURMET_MENU = {
  href: `docs/dorada-foods-almuerzos.pdf?v=${version}`,
  title: "Desayunos y Almuerzos",
  subtitle: "Ver menú completo en PDF",
};

const RAPIDAS_MENU = {
  href: `/docs/dorada-foods-comida-rapida.pdf?v=${version}`,
  title: "Comidas Rápidas y Asados",
  subtitle: "Ver menú de comidas rápidas y asados en PDF",
};

const WHATSAPP_URL = "https://wa.me/573332926737?text=Hola,%20quiero%20hacer%20un%20pedido";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/doradafoods",
    name: "Instagram",
    description: "Síguenos para ver nuestros platos",
    badgeClassName: "badge-ig",
    badgeContent: "IG",
  },
  {
    href: "https://www.facebook.com/doradafoods",
    name: "Facebook",
    description: "Únete a nuestra comunidad",
    badgeClassName: "badge-fb",
    badgeContent: "f",
  },
  {
    href: WHATSAPP_URL,
    name: "WhatsApp",
    description: "Haz tu pedido ahora",
    badgeClassName: "badge-wa",
    badgeContent: "W",
  },
  {
    href: "https://www.tiktok.com/@doradafoods",
    name: "TikTok",
    description: "Síguenos en TikTok",
    badgeClassName: "badge-tt",
    badgeContent: "TT",
  },
];

const SCHEDULE_RECHECK_MS = 5 * 60 * 1000;

export default function DoradaFoodsLinkPage() {
  const currentYear = new Date().getFullYear();
  const hoverCapable = useHoverCapable();
  const [hoveredMenu, setHoveredMenu] = useState<MenuKey>(null);
  const [scheduledMenu, setScheduledMenu] = useState<MenuKey>(null);

  useEffect(() => {
    if (hoverCapable) return;

    const update = () => setScheduledMenu(resolveScheduledMenu());
    update();
    const interval = setInterval(update, SCHEDULE_RECHECK_MS);
    return () => clearInterval(interval);
  }, [hoverCapable]);

  const activeMenu = hoverCapable ? hoveredMenu : scheduledMenu;

  return (
    <>
      <AmbientBackground />
      <MenuPhotoLayer active={activeMenu} />

      <main className='linkpage'>
        <header>
          <div className='logo-wrap'>
            <span className='logo-ring' />
            <img src='/dorada-foods-logo.png' alt='Dorada Foods' />
          </div>
          {/* <h1>Dorada Foods</h1>
          <p className="kicker">Restaurante Premium</p> */}
        </header>

        <section className='menus'>
          <div className='rule'>
            <span />
            <b>Nuestras cartas</b>
            <span />
          </div>

          <MenuCard
            href={GOURMET_MENU.href}
            title={GOURMET_MENU.title}
            subtitle={GOURMET_MENU.subtitle}
            variant='gourmet'
            onPointerActivate={hoverCapable ? () => setHoveredMenu("gourmet") : undefined}
            onPointerDeactivate={hoverCapable ? () => setHoveredMenu(null) : undefined}
            onClick={() =>
              pushToDataLayer({
                event: "menu_click",
                menu: "gourmet",
                active_menu_context: activeMenu,
              })
            }
          />

          <MenuCard
            href={RAPIDAS_MENU.href}
            title={RAPIDAS_MENU.title}
            subtitle={RAPIDAS_MENU.subtitle}
            variant='rapidas'
            onPointerActivate={hoverCapable ? () => setHoveredMenu("rapidas") : undefined}
            onPointerDeactivate={hoverCapable ? () => setHoveredMenu(null) : undefined}
            onClick={() =>
              pushToDataLayer({
                event: "menu_click",
                menu: "rapidas",
                active_menu_context: activeMenu,
              })
            }
          />

          <a
            className='wa-btn'
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() =>
              pushToDataLayer({ event: "whatsapp_click", active_menu_context: activeMenu })
            }
          >
            <span className='wa-dot' />
            Haz tu pedido ahora por WhatsApp
          </a>
        </section>

        <div className='scroll-cue'>
          <span>Conócenos</span>
          <span className='arrow'>&#8595;</span>
        </div>

        <section className='about'>
          <p>
            <strong>Somos una nueva familia</strong> que está cocinando algo realmente sabroso para
            ti.
          </p>
          <p>
            Desde comidas a la carta hasta opciones rápidas, cada plato está preparado con amor y
            los mejores ingredientes.
          </p>
          <p className='bienvenida'>¡Bienvenido a nuestra mesa!</p>
        </section>

        <section className='socials'>
          <span>Síguenos</span>
          <div className='list'>
            {SOCIAL_LINKS.map((social) => (
              <SocialRow
                key={social.name}
                {...social}
                onClick={
                  social.href === WHATSAPP_URL
                    ? () =>
                        pushToDataLayer({
                          event: "whatsapp_click",
                          active_menu_context: activeMenu,
                        })
                    : undefined
                }
              />
            ))}
          </div>
        </section>

        <footer>
          <p>© {currentYear} Dorada Foods. Todos los derechos reservados.</p>
          <p>Cocinando con amor desde el corazón</p>
        </footer>
      </main>
    </>
  );
}
