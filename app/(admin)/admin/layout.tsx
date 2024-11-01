"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthenticationProvider, useAuthContext } from "@/lib/AuthenticationProvider";

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
    <AuthenticationProvider>
      <AdminNavbar />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </AuthenticationProvider>
  );
}