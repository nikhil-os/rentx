// AccessoriesList.js
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
        const response = await api.get("/rentals");
        console.log("✅ Full API response:", response);

        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        const filtered = data.filter((item) => {
          const category = (item.category || item.Category || "").toLowerCase().trim();
          return category === "accessories";
        });

        console.log("🎯 Filtered accessories:", filtered);
        setAccessoriesItems(filtered);
      } catch (err) {
        const message =
          typeof err === "string"
            ? err
            : err?.response?.data?.message || err.message || "Failed to load accessories items.";
        setError(message);
        console.error("❌ Error loading accessories:", message);
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
