'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';

const categorySlugs = [
	"vehicles", "kids", "furniture", "fashion",
	"decor", "electronics", "accessories", "sports",
	"female", "male"
];

export default function HeroSection() {
	const [slides, setSlides] = useState([]);
	const [current, setCurrent] = useState(0);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setLoaded(true), 200);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		async function fetchSlides() {
			try {
				setLoading(true);
				setError(null);
				const data = await api.get("/rentals");
				const allProducts = [];
				for (const category of categorySlugs) {
					const filtered = data.filter(
						(item) =>
							(item.category || item.Category || "").toLowerCase().trim() === category
					);
					allProducts.push(...filtered);
				}
				const mapped = allProducts.map((item) => ({
					image:
						item.image && !item.image.startsWith("http")
							? `http://localhost:5000${item.image}`
							: item.image || item.img || "/ref1.png",
					title: item.name || item.title || "Product",
					subtitle: item.price ? `₹${item.price}/day` : item.category || "",
					button: { text: "Rent Now", link: `/booking?rentalId=${item._id}` },
				}));
				setSlides(
					mapped.length
						? mapped
						: [getFallbackSlide("No products found", "Please check back later.")]
				);
			} catch (e) {
				setError(e.message || 'Failed to fetch products');
				setSlides([
					getFallbackSlide("Connection Error", "Could not connect to the server.")
				]);
			} finally {
				setLoading(false);
			}
		}
		fetchSlides();
	}, []);

	const getFallbackSlide = (title, subtitle) => ({
		image: "/ref1.png",
		title,
		subtitle,
		button: { text: "Explore", link: "/category" },
	});

	useEffect(() => {
		if (slides.length === 0) return;
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 3500);
		return () => clearInterval(interval);
	}, [slides]);

	const goTo = (idx) => setCurrent(idx);
	const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
	const next = () => setCurrent((current + 1) % slides.length);

	return (
		<section className="relative overflow-hidden min-h-[65vh] bg-[#0A0F2C] text-white flex items-center justify-center px-6 py-12">
			{/* Glowing Blobs */}
			<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
				<div className="absolute top-[10%] left-[5%] w-[220px] h-[220px] bg-[#FFD700] opacity-10 blur-2xl animate-pulse rounded-full" />
				<div className="absolute bottom-[5%] right-[5%] w-[180px] h-[180px] bg-[#F0C9B7] opacity-10 blur-2xl animate-ping rounded-full" />
			</div>

			{/* Main Content */}
			<div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-start justify-between gap-0 px-0">

				{/* Left Text Content */}
				<motion.div
					initial={{ opacity: 0, x: -60 }}
					animate={loaded ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 1 }}
					className="text-left lg:w-[48%] w-full px-2"
				>
					<h1 className="text-4xl md:text-5xl font-serif font-bold text-[#EAE7DC] leading-tight">
						Rent Anything.<br />Anytime.<br />Anywhere.
					</h1>
					<p className="text-base md:text-lg text-[#D3D6DB] max-w-md leading-relaxed">
						India’s smartest rental platform for gadgets, fashion, vehicles and more.
					</p>
					<div className="flex gap-4 mt-6">
						<a
							href="/category"
							className="px-6 py-3 bg-[#F5E6C8] text-[#0A0F2C] rounded-md font-semibold text-base shadow hover:bg-white transition"
						>
							Start Renting
						</a>
						<a
							href="/add-product"
							className="px-6 py-3 border border-[#F5E6C8] text-[#F5E6C8] rounded-md text-base hover:bg-[#F5E6C8] hover:text-[#0A0F2C] transition"
						>
							List Your Item
						</a>
					</div>
					{error && (
						<div className="mt-4 p-3 bg-red-200/20 text-red-300 rounded-lg border border-red-300">
							<p><strong>Error:</strong> {error}</p>
							<p className="text-sm mt-1">Make sure backend is running at http://localhost:5000</p>
						</div>
					)}
				</motion.div>

				{/* Right Slider Content */}
						<motion.div
						initial={{ opacity: 0, x: 60 }}
						animate={loaded ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 1.2 }}
						className="lg:w-[48%] w-full flex justify-end px-2"
						>

					<div className="relative w-full max-w-[420px] h-[520px] rounded-2xl overflow-hidden border border-[#F5E6C8] bg-[#1D2541] shadow-lg">
						{loading ? (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-100/60">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
							</div>
						) : (
							slides.map((slide, idx) => (
								<div
									key={idx}
									className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
								>
									<Image
										src={slide.image}
										alt={slide.title}
										fill
										className="object-cover"
										priority={idx === 0}
									/>
									<div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end rounded-b-xl">
										<h3 className="text-lg font-semibold text-white">{slide.title}</h3>
										<p className="text-sm text-white mb-1">{slide.subtitle}</p>
										<a
											href={slide.button.link}
											className="inline-block px-4 py-2 mt-2 bg-[#FFD700] text-[#1A1A1A] rounded hover:bg-white transition text-sm"
										>
											{slide.button.text}
										</a>
									</div>
								</div>
							))
						)}
						{/* Dots */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
							{slides.map((_, idx) => (
								<button
									key={idx}
									onClick={() => goTo(idx)}
									className={`w-3 h-3 rounded-full ${idx === current ? "bg-[#FFD700]" : "bg-white/40"} border border-white`}
								/>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
