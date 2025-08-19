"use client";

import { useEffect, useRef } from "react";

export default function ValuesSlider() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const values = [
    { title: "Integrity", text: "Protecting authenticity and originality in every interaction." },
    { title: "Innovation", text: "Applying cutting-edge watermarking technology to real-world challenges." },
    { title: "Trust", text: "Building confidence between sellers, buyers, and platforms." },
    { title: "Scalability", text: "Designing solutions adaptable across industries and regions." },
    { title: "Collaboration", text: "Working with academia, business, and government to safeguard digital rights." },
    { title: "Sustainability", text: "Fostering a fair and reliable marketplace for long-term growth." },
  ];

  const scrollSpeed = 0.5;
  
  const startAnimation = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const animate = () => {
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += scrollSpeed;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    startAnimation();

    slider.addEventListener('mouseenter', stopAnimation);
    slider.addEventListener('mouseleave', startAnimation);

    return () => {
      stopAnimation();
      slider.removeEventListener('mouseenter', stopAnimation);
      slider.removeEventListener('mouseleave', startAnimation);
    };
  }, []);

  return (
  <section className="bg-cream  py-2 overflow-hidden">
    <div ref={sliderRef} className="flex overflow-x-scroll no-scrollbar">
      {[...values, ...values].map((value, i) => (
        <div
          key={i}
          className="value-card min-w-[90vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[20vw] 
                     p-6 
                     transition-all mx-0 sm:mx-4 bg-cream text-center"
        >
          <h4 className="font-playfair text-black font-semibold text-xl mb-2 text-primary">
            {value.title}
          </h4>
          <p className="font-inter text-black text-sm leading-relaxed">{value.text}</p>
        </div>
      ))}
    </div>
  </section>
);
}