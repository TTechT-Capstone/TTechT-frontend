import Header from "../components/common/Header";
import SubHeader from "../components/common/SubHeader";
import Footer from '../components/common/Footer';


import "../globals.css";



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
