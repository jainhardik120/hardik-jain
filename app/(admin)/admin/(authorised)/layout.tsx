"use client"

import Footer from "@/components/Footer";
import { AuthenticationProvider, useAuthContext } from "@/lib/AuthenticationProvider";
import Navbar from "../../../../components/Navbar";
import Link from "next/link";
import LoadingPage from "@/app/loading";

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
  const { isLoggedIn, loading } = useAuthContext();

  return (
    <>
      {
        loading ? (
          <LoadingPage/>
        ) : (
          <>
            {(isLoggedIn) ? children : <>
              <div className="flex justify-center items-center h-[80vh]">
                <div className="text-center">
                  <p className="text-lg">
                    Please <Link className="text-blue-500" href="/admin/login">Login</Link> to access the Admin Page
                  </p>
                </div>
              </div>
            </>}
          </>
        )
      }
    </>
  );
}