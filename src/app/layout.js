import { Urbanist, Roboto } from "next/font/google";

import "./globals.css";

const urbanist = Urbanist({
  //variable: "--font-urbanist",
  subsets: ["latin"],
})

const roboto = Roboto({
  //variable: "--font-roboto",
  subsets: ["latin"],
})


export const metadata = {
  title: "Origity",
  description: "Ecommerce website with invisible watermark algorithm",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${urbanist.className} ${roboto.className}`}>
      <body>{children}</body>
    </html>
  );
}
