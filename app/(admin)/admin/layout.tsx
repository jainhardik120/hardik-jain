import Navbar from "../../../components/PortfolioComponents/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar navLinks={[
        { title: "Posts", path: "/admin/post" },
        { title: "Projects", path: "/admin/project" },
        { title: "Skills", path: "/admin/skill" },
        { title: "Login", path: "/admin/login" }
      ]} LogoPath="/admin" LogoText="Admin Home" HideLogo={false} />
      <div className="mt-24 px-4">
        {children}
      </div>
    </main>
  );
}