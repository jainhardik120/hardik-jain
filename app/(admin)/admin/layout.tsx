"use client"

import { AuthenticationProvider, useAuthContext } from "@/lib/AuthenticationProvider";
import Navbar from "../../../components/Navbar";

const AdminNavbar = () => {
  const { isLoggedIn, logOut } = useAuthContext();
  return (
    <Navbar navLinks={[
      { title: "Posts", path: "/admin/post" },
      { title: "Projects", path: "/admin/project" },
      { title: "Skills", path: "/admin/skill" },
      { title: isLoggedIn ? "Logout" : "Login", path: isLoggedIn ? undefined : "/admin/login", onClick: isLoggedIn ? logOut : undefined }
    ]} LogoPath="/admin" LogoText="Admin Home" HideLogo={false} />
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen">
      <AuthenticationProvider>
        <AdminNavbar />
        <div className="mt-24 px-4">
          {children}
        </div>
      </AuthenticationProvider>
    </main>
  );
}