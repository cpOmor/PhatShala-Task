import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./../globals.css";
import Header from "../components/UI/Home/Header";
import { Providers } from "../lib/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paatsala - Your Learning Partner",
  description:
    "Paatsala is a platform that connects students with tutors for personalized learning experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
