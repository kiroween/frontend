import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TimeGrave - 과거를 묻고, 미래를 부활하라",
  description: "기억의 사후 세계, TimeGrave에 오신 것을 환영합니다.",
  keywords: ["타임캡슐", "기억", "추억", "미래", "TimeGrave"],
  authors: [{ name: "TimeGrave Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
