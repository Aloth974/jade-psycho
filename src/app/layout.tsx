import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/app/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jade Psycho",
  description: "Site web du cabinet de Jade Techer",
  authors: { name: `@Aloth974`, url: `https://olivierleclercq.xyz` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-full flex flex-col justify-between">
          <header>
            <h1>
              Jade Techer
            </h1>
          </header>

          <main>
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
