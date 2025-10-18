import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { SWRProvider } from "@/components/providers/swr-provider";
import AuthProvider from "@/components/providers/auth-provider";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Sandy Space - Mode, Beauté & Bien-être",
  description: "Découvrez notre sélection soigneusement choisie de robes, pantalons, chaussures, compléments alimentaires, perles et sacs à main pour sublimer votre style et votre santé.",
  keywords: "mode, robes, pantalons, chaussures, compléments alimentaires, perles, sacs à main, fashion, beauté, bien-être",
  authors: [{ name: "Sandy Space" }],
  creator: "Sandy Space",
  publisher: "Sandy Space",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sandyspace.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sandy Space - Mode, Beauté & Bien-être",
    description: "Découvrez notre sélection soigneusement choisie de robes, pantalons, chaussures, compléments alimentaires, perles et sacs à main.",
    url: 'https://sandyspace.com',
    siteName: 'Sandy Space',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sandy Space - Mode, Beauté & Bien-être',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sandy Space - Mode, Beauté & Bien-être",
    description: "Découvrez notre sélection soigneusement choisie de robes, pantalons, chaussures, compléments alimentaires, perles et sacs à main.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
        <html lang="fr">
          <body
            className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
          >
        <AuthProvider>
          <SWRProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <BackToTop />
            </div>
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
