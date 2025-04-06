import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {children}
      <footer className="w-full max-w-md mt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Hardik Jain. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link href="/terms" className="hover:text-slate-900">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-slate-900">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
