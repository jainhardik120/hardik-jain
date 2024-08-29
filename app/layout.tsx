import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hardik Jain | Android & Web Developer",
  description: "Meet Hardik Jain, a passionate Android and Web Developer. With a strong foundation in C++, Kotlin, TypeScript, and more, he's crafted innovative projects and gained valuable experience. Explore his portfolio to see his work, learn about his skills and achievements, and connect to collaborate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="ahrefs-site-verification" content="3fd571154607516456a457bbc67c308bc1c1e82db7b0ae02c3ef0d20cfebbf7e" />
      </head>
      <body className={cn(inter.className, "flex flex-col h-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}