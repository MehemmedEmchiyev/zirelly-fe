import LegalPageContent from "@/components/legal/LegalPageContent";
import { API_URL } from "@/utils/api";
import { buildOpenGraph } from "@/utils/og";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: {
    title: "Çatdırılma və Ödəmə",
    description: "Zirelly çatdırılma və ödəmə qaydaları",
  },
  en: {
    title: "Delivery & Payment",
    description: "Zirelly delivery and payment terms",
  },
  ru: {
    title: "Доставка и оплата",
    description: "Условия доставки и оплаты Zirelly",
  },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  let openGraph = { title: meta.title, description: meta.description, url: "/catdirilma-ve-odeme" };

  try {
    const response = await fetch(`${API_URL}/legal/delivery-payment?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();
      openGraph = buildOpenGraph(data, {
        url: "/catdirilma-ve-odeme",
        title: meta.title,
        description: meta.description,
      });
    }
  } catch {
    // API əlçatan olmayanda defolt OG qalır
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/catdirilma-ve-odeme" },
    openGraph,
  };
}

export default function DeliveryPayment() {
  return <LegalPageContent slug="delivery-payment" />;
}
