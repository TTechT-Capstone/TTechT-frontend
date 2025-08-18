"use client";

import Image from "next/image";

export default function AboutUsPage() {
  return (
    <main className="font-inter pt-10 sm:pt-12 min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="px-4 md:px-16 py-8">
        <div className="mx-auto">
          {/* Section Title */}{" "}
          <h1 className="font-playfair text-2xl sm:text-3xl font-semibold mb-6 text-center md:text-left">
            {" "}
            Our Story, Vision, and Values{" "}
          </h1>
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl relative overflow-hidden">
            <Image
              src="/about-us.jpeg"
              alt="Team collaborating on a project"
              fill
              className="object-cover"
              priority
            />
            {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
              <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white text-center drop-shadow-md">
                Our Story, Vision, and Values
              </h1>
            </div> */}
          </div>
        </div>
      </section>

      {/* About Us & Quote Section */}
      <section className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-12 items-center md:items-start">
          {/* About Us Card */}
          <div className="w-full md:w-2/3 order-2 md:order-1 mt-8 md:mt-0">
            <div className="bg-primary text-white rounded-2xl p-8 sm:p-12 shadow-xl">
              <h3 className="font-playfair font-semibold mb-6 text-left text-2xl sm:text-3xl">
                ABOUT US
              </h3>
              <p className="font-inter text-base sm:text-lg mb-6 leading-relaxed opacity-90">
                Vietnam’s e-commerce industry is booming, but it faces ongoing 
                challenges like counterfeit goods and unauthorized image use. 
                Sellers often see their product photos stolen by fraudulent 
                vendors, leading to lost revenue, reduced trust, and reputational damage.
              </p>
              <p className="font-inter text-base sm:text-lg leading-relaxed opacity-90">
                To address this, the Seamless Security project—launched under 
                RMIT Vietnam’s School of Science, Engineering & Technology—integrates 
                invisible digital watermarking into product images. This ensures 
                authenticity, safeguards sellers, and builds consumer confidence 
                in a transparent and trustworthy online marketplace.
              </p>
            </div>
          </div>

          {/* Quote + Image */}
          <div className="w-full md:w-1/3 flex flex-col order-1 md:order-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-playfair text-lg sm:text-xl text-gray-700 leading-snug italic border-l-4 border-primary pl-4">
                “We are shaping the future of e-commerce by embedding trust and 
                originality into every product image.”
              </h2>
            </div>
            <div>
              <Image
                src="/shop.png"
                width={500}
                height={300}
                alt="About Us"
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="px-4 md:px-16 py-4">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/2 rounded-xl p-6 sm:p-10 border border-gray-200 shadow-sm mb-6 md:mb-0">
            <h3 className="font-playfair font-semibold mb-4 text-base sm:text-2xl text-primary">
              Vision
            </h3>
            <p className="font-inter text-sm sm:text-base leading-relaxed">
              To create a secure, transparent, and trustworthy digital marketplace 
              where sellers are protected, buyers have confidence, and Vietnam 
              leads Southeast Asia in digital rights protection.
            </p>
          </div>
          <div className="w-full md:w-1/2 rounded-xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            <h3 className="font-playfair font-semibold mb-4 text-base sm:text-2xl text-primary">
              Mission
            </h3>
            <p className="font-inter text-sm sm:text-base leading-relaxed">
              Our mission is to safeguard product authenticity by embedding invisible 
              watermarks into images, empowering sellers with ownership proof, 
              enhancing consumer trust, and supporting Vietnam’s digital economy 
              through innovation and fairness.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 md:px-16 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Integrity", text: "Protecting authenticity and originality in every interaction." },
            { title: "Innovation", text: "Applying cutting-edge watermarking technology to real-world challenges." },
            { title: "Trust", text: "Building confidence between sellers, buyers, and platforms." },
            { title: "Scalability", text: "Designing solutions adaptable across industries and regions." },
            { title: "Collaboration", text: "Working with academia, business, and government to safeguard digital rights." },
            { title: "Sustainability", text: "Fostering a fair and reliable marketplace for long-term growth." },
          ].map((value, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-playfair font-semibold text-lg mb-2 text-primary">
                {value.title}
              </h4>
              <p className="font-roboto text-sm leading-relaxed">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
