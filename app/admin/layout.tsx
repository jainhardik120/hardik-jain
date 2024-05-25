import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar navLinks={[
        { title: "Posts", path: "/admin/post" },
        { title: "Projects", path: "/admin/project" },
        { title: "Skills", path: "/admin/skill" },
        { title: "Login", path: "/admin/login" }
      ]} LogoPath="/admin" LogoText="Admin Home" HideLogo={false}/>
      <div className="px-12 pt-20">
        {children}
      </div>
    </main>
  );
}
