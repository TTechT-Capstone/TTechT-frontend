import Header from "@/app/components/common/Header";
import SubHeader from "@/app/components/common/SubHeader";
import Footer from '@/app/components/common/Footer';


import "@/app/globals.css";



export default function CustomerLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SubHeader />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
