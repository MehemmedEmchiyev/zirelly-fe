import sliderImage from "@/assets/images/products/Sliderİmage.png";

export const productDetail = {
  slug: "lumiere-cream",
  title: "Lorem Ipsum Lorem Ipsum Lorem Lorem Ipsum Lorem Ipsum Lorem",
  reviewsCount: 0,
  rating: 5,
  ratingCount: 5,
  onlineOrdersOnly: true,
  originalPrice: "199.99 ₼",
  price: "129.99 ₼",
  note: "The discount is valid until July 31, 2026. Prices may change during the promotional period",
  images: [sliderImage, sliderImage, sliderImage, sliderImage, sliderImage],
  features: [
    { label: "Details", value: "Azerbaijan" },
    { label: "Brend:", value: "Azerbaijan" },
    { label: "Brend:", value: "Azerbaijan" },
    { label: "Brend:", value: "Azerbaijan" },
  ],
  howToUse: [
    {
      step: "01",
      title: "Cleanse",
      description: "Start with freshly cleansed skin, gently patted dry.",
      icon: "cleanse",
    },
    {
      step: "02",
      title: "Dispense",
      description: "Apply 2–3 drops of serum onto your fingertips.",
      icon: "dispense",
    },
    {
      step: "03",
      title: "Activate",
      description: "Warm between palms for a few seconds.",
      icon: "activate",
    },
    {
      step: "04",
      title: "Press",
      description: "Press evenly across face, neck, and décolletage.",
      icon: "press",
    },
    {
      step: "05",
      title: "Seal",
      description: "Follow with moisturizer while skin is still slightly damp.",
      icon: "seal",
    },
  ],
  proTip:
    "Apply at night for maximum absorption — skin repairs itself during sleep, amplifying every active ingredient.",
};

export function getProductBySlug(slug) {
  return {
    ...productDetail,
    slug,
  };
}
