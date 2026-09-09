import { Instagram, Facebook, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TikTokIcon } from "@/components/tiktok-icon";

export default function DoradaFoodsLinktree() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Desayunos y Almuerzos",
      icon: FileText,
      url: "/docs/dorada-foods-almuerzos.pdf",
      description: "Ver menú completo en PDF",
      gradient: "from-purple-600 to-purple-800",
    },
    {
      name: "Comidas Rápidas y Asados",
      icon: FileText,
      url: "/docs/dorada-foods-comida-rapida.pdf",
      description: "Ver menú de comidas rápidas y asados en PDF",
      gradient: "from-red-600 to-red-800",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/doradafoods",
      description: "Síguenos para ver nuestros platos",
      gradient: "from-pink-500 to-orange-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/doradafoods",
      description: "Únete a nuestra comunidad",
      gradient: "from-blue-600 to-blue-800",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/573332926737?text=Hola,%20quiero%20hacer%20un%20pedido",
      description: "Haz tu pedido ahora",
      gradient: "from-green-500 to-green-700",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: "https://www.tiktok.com/@doradafoods",
      description: "Síguenos en TikTok",
      gradient: "from-gray-800 to-black",
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-30'>
        <div
          className='w-full h-full'
          style={{
            backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-8 max-w-md'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          {/* Logo */}
          <div className='mb-6'>
            <img
              src='/dorada-foods-logo.png'
              alt='Dorada Foods'
              className='w-50 h-50 mx-auto object-contain drop-shadow-xl'
            />
          </div>

          {/* Brand Name */}
          {/* <h1 className='text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2'>
            Dorada Foods
          </h1> */}

          {/* Subtitle */}
          {/* <p className='text-lg font-medium text-amber-800 mb-4'>Restaurante Premium</p> */}

          {/* Description */}
          <Card className='p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg'>
            <p className='text-gray-700 leading-relaxed text-center'>
              🍽️ <span className='font-semibold text-amber-700'>Somos una nueva familia</span> que
              está cocinando algo realmente sabroso para ti.
              <br />
              <br />
              <span className='text-orange-600 font-medium'>¡Bienvenido a nuestra mesa! 👨‍🍳👩‍🍳</span>
            </p>
          </Card>
        </div>

        {/* Social Links */}
        <div className='space-y-4 mb-12'>
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button
                key={index}
                asChild
                className='w-full h-16 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0'
              >
                <a
                  href={link.url}
                  className={`bg-gradient-to-r ${link.gradient} flex items-center justify-center gap-4 rounded-xl`}
                >
                  <Icon className='w-6 h-6' />
                  <div className='text-center'>
                    <div className='font-bold'>{link.name}</div>
                    <div className='text-sm opacity-90'>{link.description}</div>
                  </div>
                </a>
              </Button>
            );
          })}
        </div>

        {/* Footer */}
        <footer className='text-center'>
          <div className='border-t border-amber-200 pt-6'>
            <p className='text-amber-700 text-sm'>
              © {currentYear} Dorada Foods. Todos los derechos reservados.
            </p>
            <p className='text-amber-600 text-xs mt-2'>Cocinando con amor desde el corazón ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
