import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./lib/providers";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: [
    "100", "200", "300", "400", "500",
    "600", "700", "800", "900",
  ],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-poppins",
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
    <html lang="en-US" className={`${roboto.variable} ${poppins.variable}`}>
      <head>
      </head>
      <body>
        {/* MAIN CONTENT */}
        <main>
          <Providers>
            {children}
            </Providers>
        </main>

        {/* FOOTER*/}
        <footer></footer>
      </body>
    </html>
  );
}
