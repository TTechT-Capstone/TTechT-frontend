"use client";
import Header from "@/app/components/common/Header";
import Footer from '@/app/components/common/Footer';
import useAuth from "@/app/hooks/useAuth";

export default function CustomerLayout({ children }) {
  const { loading, isAuthenticated, userRole } = useAuth();
  return (
    <>
      <Header />
      <main className="mt-8 sm:mt-10 flex-grow">{children}</main>
      <Footer />
    </>
  );
}

