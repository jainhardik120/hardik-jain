import Footer from '@/components/sidebar/site-footer';
import Navbar from '@/components/sidebar/site-header';
import { auth } from '@/server/auth';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      {children}
      <Footer />
    </div>
  );
}
