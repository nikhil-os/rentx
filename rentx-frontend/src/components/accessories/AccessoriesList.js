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
        const data = await api.get("/rentals"); // ✅ NO .json()

        console.log("Fetched data from /rentals:", data);

        const filtered = (Array.isArray(data) ? data : []).filter(item => {
          const category = (item.category || item.Category || "").toLowerCase().trim();
          return category === "accessories";
        });

        setAccessoriesItems(filtered);
        console.log("Filtered accessories:", filtered);

      } catch (err) {
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
    console.log("Full API response:", res);
console.log("res.data:", res.data);

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
