import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/app/components/layout/footer";
import Header from "@/app/components/layout/header";
import Main from "@/app/components/layout/main";
import RichSnippet from "@/app/components/seo/rich-snippet";
import metadataConfiguration from "@/app/components/seo/metadataConfiguration";
import Head from "next/head";

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

export const metadata: Metadata = metadataConfiguration;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <Head>
        <title>
          {metadata.title as string}
        </title>
        <meta
          name="description"
          content={metadata.description as string}
          key="desc"
        />
        <meta
          property="og:description"
          content="And a social description for our cool page"
        />
        <meta
          property="og:image"
          content="https://example.com/images/cool-page.jpg"
        />
      </Head>
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
