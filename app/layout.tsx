import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Header from '@/components/layout/Header'
import ClientComponents from '@/components/layout/ClientComponents'
import PageTransition from '@/components/layout/PageTransition'
import '@/styles/globals.css'

const bebasNeue = localFont({
  src: '../public/fonts/bebas-neue-400.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-bebas',
  display: 'swap',
})

const interTight = localFont({
  src: [
    {
      path: '../public/fonts/inter-tight-variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter-tight-variable-italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Laert Costa Studio — Arquitetura e Visualização 3D',
  description:
    'Projetos residenciais, comerciais e renders 3D premium. Parceiro técnico para escritórios e incorporadoras em Campo Grande, MS.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://laertcostastudio.com.br',
    siteName: 'Laert Costa Studio',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${interTight.variable}`}
    >
      <body>
        <ClientComponents />
        <Header />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
