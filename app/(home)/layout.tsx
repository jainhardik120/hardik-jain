import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Navbar navLinks={[
      { title: "Portfolio", path: "/" }
    ]} LogoPath="/blog/1" LogoText="Hardik Jain" HideLogo={false} />
    <main className="pt-20">
      {children}
    </main>
    <Footer />
  </>
}