import ProfilePage from "@/components/profile/ProfilePage";
import RequireAuth from "@/components/common/RequireAuth";

export const metadata = {
  title: "Profile",
  description: "Manage your account",
};

export default function Profile() {
  return (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  );
}
