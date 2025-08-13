import Header from "@/app/components/common/Header";
import SubHeader from "@/app/components/common/SubHeader";
import Footer from '@/app/components/common/Footer';


import "@/app/globals.css";

export default function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      <main className="mt-8 sm:mt-10 flex-grow">{children}</main>
      <Footer />
    </>
  );
}

