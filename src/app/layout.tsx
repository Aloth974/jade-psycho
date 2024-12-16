import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/app/components/layout/footer";
import Header from "@/app/components/layout/header";
import Main from "@/app/components/layout/main";
import RichSnippet from "@/app/components/seo/rich-snippet";

const lucioleRegular = localFont({
  src: "./fonts/Luciole-Regular.ttf",
  variable: "--font-luciole-regular",
  weight: "100 700",
});
const lucioleBold = localFont({
  src: "./fonts/Luciole-Bold.ttf",
  variable: "--font-luciole-bold",
  weight: "700 900",
});
const lucioleRegularItalic = localFont({
  src: "./fonts/Luciole-Regular-Italic.ttf",
  variable: "--font-luciole-regular-italic",
  weight: "100 700",
});
const lucioleBoldItalic = localFont({
  src: "./fonts/Luciole-Bold-Italic.ttf",
  variable: "--font-luciole-bold-italic",
  weight: "700 900",
});

export const metadata: Metadata = {
  title: "Jade Psycho",
  description: "Jade Techer Psycho soins à la personne formations analyse pratique pro 84100 orange",
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
        className={`h-full ${lucioleRegular.variable} ${lucioleBold.variable} ${lucioleRegularItalic.variable} ${lucioleBoldItalic.variable} antialiased`}
      >
        <Header />

        <Main>
          {children}
        </Main>

        <Footer />
        <RichSnippet />
      </body>
    </html>
  );
}
