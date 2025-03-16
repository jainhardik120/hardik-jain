import Footer from '@/components/site/site-footer';
import ClientNavBar from './client-navbar';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientNavBar />
      {children}
      <Footer />
    </div>
  );
}
