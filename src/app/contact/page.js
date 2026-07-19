import ContactPage from "@/components/contact/ContactPage";
import { API_URL } from "@/utils/api";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_URL}/contact`);

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title || "Contact Us",
        description: data.meta_description || "Get in touch with Zirelly",
      };
    }
  } catch {
    // API əlçatan olmayanda defolt metadata qalır
  }

  return {
    title: "Contact Us",
    description: "Get in touch with Zirelly",
  };
}

export default function Contact() {
  return <ContactPage />;
}
