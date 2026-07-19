import CartPage from "@/components/cart/CartPage";
import RequireAuth from "@/components/common/RequireAuth";

export const metadata = {
  title: "My Cart",
  description: "View your shopping cart",
};

export default function Cart() {
  return (
    <RequireAuth>
      <CartPage />
    </RequireAuth>
  );
}
