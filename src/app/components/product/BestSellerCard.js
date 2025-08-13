import useMediaQuery from "@/app/hooks/useMediaQuery";
import Image from "next/image";

export default function BestSellerCard({ name, price, img, onClick }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div
      className="text-left cursor-pointer font-inter"
      onClick={onClick}
      style={{
        width: isMobile ? "200px" : "350px", // Giới hạn khung
      }}
    >
      {/* Image container */}
      <div
        className={`relative overflow-hidden ${
          isMobile ? "h-[200px] w-[200px]" : "h-[350px] w-[350px]"
        }`}
      >
        <Image
          src={img}
          alt={name}
          fill
          className="object-cover"
          sizes={isMobile ? "200px" : "350px"}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col mt-2">
        <p className="text-primary text-sm sm:text-md font-normal whitespace-normal break-words">
          {name}
        </p>
        <p className="text-sm sm:text-md font-semibold text-black">
          {price ? Number(price).toFixed(2) : "0.00"} USD
        </p>
      </div>
    </div>
  );
}
