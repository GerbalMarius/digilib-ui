import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digilib",
  description: "Digital library web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className="min-h-screen">

        <header>

        </header>

        {/* MAIN CONTENT */}
        <main className="mx-auto max-w-7xl px-6 py-10">
          {children}
        </main>

        {/* FOOTER */}
        <footer>
          © {new Date().getFullYear()} Digilib
        </footer>

      </body>
    </html>
  );
}
