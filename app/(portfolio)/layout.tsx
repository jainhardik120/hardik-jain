import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const navLinks = [
  {
    title: "About",
    path: "/#about",
  },
  {
    title: "Skills",
    path: "/#skills",
  },
  {
    title: "Projects",
    path: "/#projects",
  },
  {
    title: "Blog",
    path: "/#blog",
  },
  {
    title: "Contact",
    path: "/#contact",
  },
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar navLinks={navLinks} LogoPath="/" LogoText="Hardik Jain" />
      {children}
      <Footer />
    </main>
  );
}