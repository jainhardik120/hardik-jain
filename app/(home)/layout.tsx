import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Navbar navLinks={[
      { title: "Portfolio", path: "/" }
    ]} LogoPath="/blog" LogoText="Home" HideLogo={false} />
    <div className="pt-20">
      {children}
    </div>
    <Footer />
  </>
}