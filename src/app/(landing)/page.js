import Image from "next/image";
import Link from "next/link";
import NewCollectionCard from "../components/product/NewCollectionCard";
import CategoryCard from "../components/product/CategoryCard";

const categories = [
  { name: "Accessories", img: "/product.jpg" },
  { name: "Dresses", img: "/product.jpg" },
  { name: "Shoes", img: "/product.jpg" },
  { name: "Shirts", img: "/product.jpg" },
];

const collections = [
    { name: "White t-shirt", price: "150,000 VND", img: "/product.jpg" },
    { name: "Summer hat", price: "80,000 VND", img: "/product.jpg" },
    { name: "Summer glasses", price: "150,000 VND", img: "/product.jpg" },
    { name: "White t-shirt", price: "150,000 VND", img: "/product.jpg" },

  ];

export default function LandingPage() {
  return (
    <main className="bg-white">
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

          <Link href="/products">
            <button className="bg-white text-black font-urbanist px-6 py-2 hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary text-white px-4 sm:px-8 md:px-16 py-12">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
      How Origity Protects Your Products
    </h2>
    <p className="font-roboto mb-10 text-center md:text-left max-w-3xl mx-auto md:mx-0">
      Every image on Origity includes a secure digital watermark. This
      invisible signature ensures authenticity and traceability.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h3 className="font-urbanist font-semibold mb-2 text-lg">
          TAMPER-PROOF PROTECTION
        </h3>
        <p className="font-roboto">
          Your watermark cannot be removed or altered.
        </p>
      </div>
      <div>
        <h3 className="font-urbanist font-semibold mb-2 text-lg">
          ONLINE TRACKING CAPABILITIES
        </h3>
        <p className="font-roboto">
          Know when and where your images are used online.
        </p>
      </div>
      <div>
        <h3 className="font-urbanist font-semibold mb-2 text-lg">
          GUARANTEED ORIGINALITY
        </h3>
        <p className="font-roboto">
          Prove your image ownership anytime.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Category Tiles Section */}
      <section className="px-8 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.name}
              title={category.name}
              img={category.img}
              />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="my-3 border-t border-black opacity-20 mx-12"></div>

      {/* New Collection Section */}
      <section className="px-8 py-12 text-center text-secondary">
        <h2 className="text-2xl font-semibold mb-8">NEW COLLECTION</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <NewCollectionCard
              key={collection.name}
                name={collection.name}
                price={collection.price}
                img={collection.img}
            />
          ))}
        </div>

        <Link href="/products">
          <button className="mt-8 px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition">
            VIEW ALL
          </button>
        </Link>
      </section>
    </main>
  );
}
