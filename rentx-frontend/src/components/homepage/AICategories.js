"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function AICategories() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  const categories = [
    {
      title: "Fashion",
      desc: "Lehengas, sherwanis, and more for your events",
      image:
        "https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&auto=format&fit=crop&q=60",
      items: "150+",
      rating: "4.9",
    },
    {
      title: "Event & Party Supplies",
      desc: "Decorations, lighting, and banquet halls",
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1350&q=80",
      items: "200+",
      rating: "4.8",
    },
    {
      title: "Real Estate",
      desc: "Apartments, offices, and event venues",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80",
      items: "100+",
      rating: "4.7",
    },
    {
      title: "Electronics",
      desc: "Cameras, laptops, and gadgets",
      image:
        "https://images.unsplash.com/photo-1589451825788-d81b78a48a33?w=600&auto=format&fit=crop&q=60",
      items: "250+",
      rating: "4.8",
    },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen py-20 bg-gradient-to-b from-[#0A0F2C] via-black to-[#0A0F2C] text-white relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#F5E6C8] mb-3">
            Explore Categories for You
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Curated rental categories based on your preferences and location, powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                width={400}
                height={160}
                className="rounded-xl mb-4 object-cover h-40 w-full"
              />
              <h5 className="text-xl font-semibold text-[#F5E6C8] mb-1">{cat.title}</h5>
              <p className="text-gray-300 text-sm mb-4">{cat.desc}</p>
              <div className="flex justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-white/10">
                <span>📦 {cat.items} items</span>
                <span>⭐ {cat.rating}/5</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
