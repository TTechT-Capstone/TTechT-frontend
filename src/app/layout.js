import { Urbanist, Roboto, Playfair_Display, Inter } from "next/font/google";

import "./globals.css";

const urbanist = Urbanist({
  //variable: "--font-urbanist",
  subsets: ["latin"],
})

const roboto = Roboto({
  //variable: "--font-roboto",
  subsets: ["latin"],
})

const playfairDisplay = Playfair_Display({
  //variable: "--font-playfair-display",
  subsets: ["latin"],
})

const inter = Inter({
  subsets: ["latin"],
  //variable: "--font-inter",
})

export const metadata = {
  title: "Origity",
  description: "Ecommerce website with invisible watermark algorithm",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${urbanist.className} ${roboto.className} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/logo/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
