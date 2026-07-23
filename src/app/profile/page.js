import ProfilePage from "@/components/profile/ProfilePage";
import RequireAuth from "@/components/common/RequireAuth";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: { title: "Profil", description: "Hesabınızı idarə edin" },
  en: { title: "Profile", description: "Manage your account" },
  ru: { title: "Профиль", description: "Управление аккаунтом" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  return { title: meta.title, description: meta.description };
}

export default function Profile() {
  return (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  );
}
