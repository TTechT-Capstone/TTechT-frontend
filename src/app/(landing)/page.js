import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Banner */}
      <section className="relative h-[600px]">
        <Image
          src="/herobanner.jpg"
          alt="Shopping woman"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-end justify-end text-center text-white bg-opacity-30 mb-10 mr-10">
          <h1 className="text-3xl italic font-medium font-urbanist mb-4">
            Original. Protected. Trusted.
          </h1>
          <button className="bg-white text-black font-urbanist px-6 py-2 hover:bg-gray-200 transition">
            SHOP NOW
          </button>
        </div>
      </section>

      <section className="bg-secondary text-white px-8 py-12">
        <h2 className="text-2xl font-bold mb-2">
          How Origity Protects Your Products
        </h2>
        <p className="font-roboto mb-6">
          Every image on Origity includes a secure digital watermark. This
          invisible signature ensures authenticity and traceability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="font-urbanist font-semibold mb-1">
              TAMPER-PROOF PROTECTION
            </h3>
            <p className="font-roboto">
              Your watermark cannot be removed or altered.
            </p>
          </div>
          <div>
            <h3 className="font-urbanist font-semibold mb-1">
              ONLINE TRACKING CAPABILITIES
            </h3>
            <p className="font-roboto">
              Know when and where your images are used online.
            </p>
          </div>
          <div>
            <h3 className="font-urbanist font-semibold mb-1">
              GUARANTEED ORIGINALITY
            </h3>
            <p className="font-roboto">
              Prove your image ownership anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tiles Section */}
      <section className="px-8 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Accessories", "Dresses", "Shoes", "Shirts"].map((category) => (
            <div key={category} className="relative group">
              <Image
                src={`/product.jpg`}
                alt={category}
                width={300}
                height={300}
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h4 className="text-lg font-bold">{category}</h4>
                <button className="text-sm mt-2 border border-white px-4 py-1">
                  SHOP
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="my-6 border-t border-black opacity-20 mx-12"></div>



      {/* New Collection Section */}
      <section className="px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-8">NEW COLLECTION</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Summer strapless dress",
              price: "350,000 VND",
              img: "/product.jpg",
            },
            { name: "White t-shirt", price: "150,000 VND", img: "/product.jpg" },
            { name: "Summer hat", price: "80,000 VND", img: "/product.jpg" },
            { name: "Summer glasses", price: "150,000 VND", img: "/product.jpg" },
          ].map((item) => (
            <div key={item.name}>
              <Image
                src={item.img}
                alt={item.name}
                width={300}
                height={300}
                className="object-cover"
              />
              <p className="mt-2 font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.price}</p>
            </div>
          ))}
        </div>
        <Link href="/product">
        <button className="mt-8 px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition">
          VIEW ALL
        </button>
        </Link>
        
      </section>
    </main>
  );
}
