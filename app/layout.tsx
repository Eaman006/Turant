import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-phone-input-2/lib/style.css';
import { Poppins } from 'next/font/google';
import { Noto_Sans } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Select the weights you need
  variable: '--font-poppins', // Define a CSS variable name
});
const notoSans = Noto_Sans({
  subsets: ['latin'], // Specify subsets like 'latin', 'cyrillic', etc.
  weight: ['300', '400', '500', '700'], // Optional: specify weights if needed
  variable: '--font-noto-sans', // Optional: define a CSS variable for Tailwind
  display: 'swap',
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turant",
  description: "Community Service App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${notoSans.className} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
