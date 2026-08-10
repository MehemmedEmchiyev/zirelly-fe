import { Suspense } from "react";
import PaymentResultContent from "@/components/payment/PaymentResultContent";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: { title: "Ödəniş nəticəsi", description: "Ödənişinizin nəticəsi" },
  en: { title: "Payment Result", description: "Your payment result" },
  ru: { title: "Результат оплаты", description: "Результат вашего платежа" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  return {
    title: meta.title,
    description: meta.description,
    robots: { index: false, follow: false },
  };
}

export default function PaymentResult() {
  return (
    <Suspense fallback={null}>
      <PaymentResultContent />
    </Suspense>
  );
}
