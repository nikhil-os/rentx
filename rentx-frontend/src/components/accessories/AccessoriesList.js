// AccessoriesList.js
// Themed content for the Accessories page (dark theme with animation)

"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AccessoriesList() {
  const [accessoriesItems, setAccessoriesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAccessories() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setAccessoriesItems(
          data.filter(
            (item) =>
              (item.category || item.Category || "").toLowerCase().trim() ===
              "accessories"
          )
        );
      } catch (err) {
        setError(
          typeof err === "string"
            ? err
            : err.message || "Failed to load accessories items."
        );
      }
      setLoading(false);
    }
    fetchAccessories();
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#0A0F2C] via-black to-[#0A0F2C] text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold font-playfair text-[#F5E6C8] text-center mb-6"
        >
          Accessories
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Discover stylish accessories to complement your look
        </motion.p>

        <CategoryTemplate
          items={accessoriesItems}
          loading={loading}
          error={error}
          categoryImage="/accessories-hero.jpg"
        />
      </div>
    </section>
  );
}
