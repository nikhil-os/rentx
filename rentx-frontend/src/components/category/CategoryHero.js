"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const fadeFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function CategoryHero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end text-white bg-gradient-to-br from-[#0A0F2C] via-black to-[#0A0F2C] overflow-hidden">
      {/* Soft Background Image */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <Image
          src="https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Category Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient fade at bottom to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0A0F2C] z-0" />

      <div className="container mx-auto px-4 pb-12">
        {/* 🔍 Search Bar at Top */}
        <motion.div
          className="mb-12 bg-[#14213D]/70 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full md:w-2/3 px-5 py-3 rounded-xl bg-[#0A0F2C]/80 border border-[#314266] text-white placeholder-[#B0BBD0] focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all duration-300"
          />
          <select
            className="w-full md:w-1/3 px-5 py-3 rounded-xl bg-[#0A0F2C]/80 border border-[#314266] text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all duration-300"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="fashion">Fashion</option>
            <option value="vehicles">Vehicles</option>
          </select>
        </motion.div>

        {/* Hero Content Aligned at Bottom */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeFromLeft}
          >
            <h1 className="text-4xl md:text-5xl font-bold font-playfair text-[#F5E6C8] mb-6">
              Browse Categories
            </h1>
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
              Find the perfect rental category for your needs. From electronics to fashion, we have it all!
            </p>
          </motion.div>

          <motion.div
            className="lg:w-1/2 w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeFromRight}
          >
            <div className="relative h-full rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-md border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Category Illustration"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
