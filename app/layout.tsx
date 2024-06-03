import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hardik Jain",
  description: "Android and Web Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        {children}
      </body>
    </html>
  );
}