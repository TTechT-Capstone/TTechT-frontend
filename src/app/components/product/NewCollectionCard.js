import Image from "next/image";

export default function NewCollectionCard({ name, price, img, onClick }) {
  return (
    <div className="text-center cursor-pointer" onClick={onClick}>
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
      <p className="mt-2 text-primary font-semibold">{name}</p>
      <p className="text-sm text-gray-600">
        {price ? Number(price).toFixed(2) : "0.00"} USD
      </p>
    </div>
  );
}
