import CartPage from "@/components/cart/CartPage";
import RequireAuth from "@/components/common/RequireAuth";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: { title: "Səbətim", description: "Səbətinizə baxın" },
  en: { title: "My Cart", description: "View your shopping cart" },
  ru: { title: "Моя корзина", description: "Просмотр корзины" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  return { title: meta.title, description: meta.description };
}

export default function Cart() {
  return (
    <RequireAuth>
      <CartPage />
    </RequireAuth>
  );
}
