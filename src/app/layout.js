import { Cormorant_Garamond, Geist } from "next/font/google";
import DeferredPopup from "@/components/layout/DeferredPopup";
import Footer from "@/components/layout/Footer";
import GlobalAuthModals from "@/components/layout/GlobalAuthModals";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { BasketProvider } from "@/context/BasketContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SITE_NAME, SITE_URL } from "@/constants/site";
import { getServerLang } from "@/utils/server-lang";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Zirelly — gözəllik və qulluq məhsulları",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zirelly MMC",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: "info@zirelly.az",
  telephone: "+994512522410",
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default async function RootLayout({ children }) {
  const lang = await getServerLang();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <LanguageProvider>
          <AuthProvider>
            <BasketProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <GlobalAuthModals />
              <DeferredPopup />
            </BasketProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
