import type { Metadata, Viewport } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

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
  title: "TimeGrave - Bury the past, Resurrect the future",
  description: "기억의 사후 세계, TimeGrave에 오신 것을 환영합니다.",
  keywords: ["Time Capsule", "기억", "추억", "미래", "TimeGrave"],
  authors: [{ name: "TimeGrave Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
