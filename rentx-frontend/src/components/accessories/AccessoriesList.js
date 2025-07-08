"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function AccessoriesList() {
  const [accessoriesItems, setAccessoriesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAccessories() {
      setLoading(true);
      setError("");

      try {
        const data = await api.get("/rentals"); // ✅ Directly get array
        console.log("✅ Full API raw:", data);

        // Defensive check
        if (!Array.isArray(data)) {
          throw new Error("Expected an array from /rentals API.");
        }

        const filtered = data.filter((item) => {
          const raw = item.category || item.Category || "";
          console.log("📦 Item category:", raw);
          return raw.toLowerCase().trim() === "accessories";
        });

        console.log("🎯 Filtered accessories:", filtered);
        setAccessoriesItems(filtered);

      } catch (err) {
        console.error("❌ Error fetching accessories:", err);
        setError(
          typeof err === "string"
            ? err
            : err?.response?.data?.message || err.message || "Failed to load accessories items."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAccessories();
  }, []);

  return (
    <CategoryTemplate
      title="Accessories"
      description="Discover stylish accessories to complement your look"
      items={accessoriesItems}
      loading={loading}
      error={error}
      categoryImage="/accessories-hero.jpg"
    />
  );
}
