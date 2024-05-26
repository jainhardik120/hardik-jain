import Footer from "@/app/components/Footer";
import Navbar from "../../components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col">
      <Navbar navLinks={[
        { title: "Posts", path: "/admin/post" },
        { title: "Projects", path: "/admin/project" },
        { title: "Skills", path: "/admin/skill" },
        { title: "Login", path: "/admin/login" }
      ]} LogoPath="/admin" LogoText="Admin Home" HideLogo={false} />
      <div className="min-h-screen mt-20 px-4">
        {children}
      </div>
      <Footer />
    </main>
  );
}
