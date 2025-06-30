import Image from "next/image";

export default function CategoryCard({ title, img, id, onClick }) {

  return (
    <div className="relative w-full overflow-hidden group cursor-pointer">
      {/* Image */}
      <div className="w-full h-[250px] relative">
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
        <button
          className="font-roboto text-sm mt-2 border border-white px-4 py-1 hover:bg-white hover:text-black transition"
          onClick={onClick}
        >
          SHOP
        </button>
      </div>
    </div>
  );
}
