import Image from "next/image";

export default function ProductCard({ name, price, img }) {
  return (
    <div className="text-center ">
      <div className="w-full md:h-[250px] h-[400px] overflow-hidden">
        <Image
          src={img}
          alt={name}
          layout="responsive"
          width={1}
          height={1}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 text-secondary font-semibold">{name}</p>
      <p className="text-sm text-gray-600">{price}</p>
    </div>
  );
}
