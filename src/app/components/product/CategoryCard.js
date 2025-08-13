import Image from "next/image";

export default function CategoryCard({ title, img, id, onClick }) {
  return (
    <div
      className="relative w-full overflow-hidden group cursor-pointer shadow-md"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative w-[100px] h-[150px] sm:w-full sm:h-[200px]">
        <Image
          src={img}
          alt={title}
          layout="fill"
          className="object-cover"
          priority={true}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition 
                   flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-4 
                   text-white px-2 sm:px-0"
      >
        <h4 className="text-md sm:text-lg font-normal font-inter line-clamp-2 max-w-[calc(100%-80px)] sm:max-w-full">
          {title}
        </h4>

        {/* <button
          className="font-roboto text-xs sm:text-sm border border-white px-3 py-1
                     hover:bg-white hover:text-black transition"
          onClick={onClick}
        >
          SHOP
        </button> */}
      </div>
    </div>
  );
}
