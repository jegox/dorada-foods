import type { Metadata } from 'next'
import { Bricolage_Grotesque, Karla } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
})

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-karla',
})

export const metadata: Metadata = {
  title: 'Dorada Foods Restaurante',
  description: 'Delicosas comidas preparadas con amor',
  generator: 'Doada Foods Generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${karla.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
