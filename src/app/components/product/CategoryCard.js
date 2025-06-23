import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ title, img }) {
  return (
    <div className="relative w-full overflow-hidden group">
      {/* Image */}
      <div className="w-full h-[250px]">
        <Image
          src={img}
          alt={title}
          layout="fill"
          className="object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex flex-col items-center justify-center text-white">
        <h4 className="text-lg font-bold font-urbanist">{title}</h4>
        <Link href={`/products?category=${title.toLowerCase()}`}>
          <button className="font-roboto text-sm mt-2 border border-white px-4 py-1 hover:bg-white hover:text-black transition">
            SHOP
          </button>
        </Link>
      </div>
    </div>
  );
}
