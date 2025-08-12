import Image from "next/image";
import { useEffect, useState } from "react";
import useMediaQuery from "@/app/hooks/useMediaQuery";

export default function NewCollectionCard({ name, price, img, onClick }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="text-left cursor-pointer font-inter" onClick={onClick}>
      {isMobile ? (
        <div className="relative w-full h-[200px] overflow-hidden">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw"
          />
        </div>
      ) : (
        <div className="w-full h-[400px] md:h-[250px] overflow-hidden">
          <Image
            src={img}
            alt={name}
            layout="responsive"
            width={1}
            height={1}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col mt-2 px-2">
        <p className="text-primary font-normal">{name}</p>
        <p className="text-sm font-semibold text-black">
          {price ? Number(price).toFixed(2) : "0.00"} USD
        </p>
      </div>
    </div>
  );
}
