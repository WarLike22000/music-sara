import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

const vazir = Vazirmatn({
  subsets: ['latin-ext'],
  weight: ['600'],
  variable: '--font-vazir'
});

export const metadata: Metadata = {
  title: "پادکستر",
  description: "موزیکت رو با بقیه به اشتراک بزار",
  icons: {
    icon: '/icons/logo.svg'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="fa" dir="rtl">
        <AudioProvider>
          <body className={`${vazir.variable} font-vazir`}>
              {children}
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
