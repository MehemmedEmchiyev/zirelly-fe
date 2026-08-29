import LegalPageContent from "@/components/legal/LegalPageContent";
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
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/catdirilma-ve-odeme" },
  };
}

export default function DeliveryPayment() {
  return <LegalPageContent slug="delivery-payment" />;
}
