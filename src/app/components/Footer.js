export default function Footer() {
  return (
    <footer className="bg-primary font-urbanist font-bold text-white py-6">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand Section */}
        <div>
          <h1 className="text-3xl">Origity</h1>
          <h2 className="text-sm italic font-semibold mt-2">
            Original. Protected. Trusted.
          </h2>
        </div>

        {/* Company Section */}
        <div>
          <p className="text-lg mb-3">OUR COMPANY</p>
          <p className="text-sm hover:underline cursor-pointer">About Us</p>
        </div>

        {/* Support Section */}
        <div>
          <p className="text-lg mb-3">SUPPORT</p>
          <p className="text-sm hover:underline cursor-pointer">Contact Us</p>
          <p className="text-sm hover:underline cursor-pointer">FAQ</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-white opacity-20 mx-12"></div>


      {/* Copyright Section */}
      <div className="text-center text-sm">
        <p>Copyright © Origity 2025.</p>
      </div>
    </footer>
  );
}
