import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>
    <main className="flex min-h-screen flex-col">
      <Navbar navLinks={[

      ]} LogoPath="/blog" LogoText="Home" HideLogo={false} />
      <div className="mt-24 px-4 min-h-svh">
        {children}
      </div>
      <Footer />
    </main>
  </>
}