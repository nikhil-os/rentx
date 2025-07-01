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
		<section className="relative overflow-hidden min-h-[90vh] bg-[#0A0F2C] text-white flex items-center justify-center px-6">
			
			{/* Glowing Blobs */}
			<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#FFD700] opacity-10 blur-3xl animate-pulse rounded-full" />
				<div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-[#F0C9B7] opacity-10 blur-2xl animate-ping rounded-full" />
			</div>

			{/* Main Content */}
			<div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
				
				{/* Left Text Content */}
				<motion.div
					initial={{ opacity: 0, x: -60 }}
					animate={loaded ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 1 }}
					className="text-left lg:w-1/2"
				>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-[#EAE7DC] drop-shadow-lg">
						Rent Anything.<br />Anytime.<br />Anywhere.
					</h1>
					<p className="text-lg text-[#D3D6DB] mb-8 leading-relaxed max-w-md">
						India’s smartest rental platform for gadgets, fashion, vehicles and more.
					</p>

					<div className="flex gap-5">
						<a
							href="/category"
							className="px-6 py-3 bg-[#F5E6C8] text-[#0A0F2C] rounded-lg font-semibold text-lg shadow hover:bg-white transition"
						>
							Start Renting
						</a>
						<a
							href="/add-product"
							className="px-6 py-3 border border-[#F5E6C8] text-[#F5E6C8] rounded-lg text-lg hover:bg-[#F5E6C8] hover:text-[#0A0F2C] transition"
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
					className="lg:w-1/2 flex justify-center"
				>
					<div className="relative w-[320px] h-[420px] rounded-2xl overflow-hidden border border-[#F5E6C8] bg-[#1D2541] shadow-xl">
						{loading ? (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-100/60">
								<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFD700]"></div>
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
									<div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end rounded-b-2xl">
										<h3 className="text-xl font-bold text-white">{slide.title}</h3>
										<p className="text-sm text-white mb-2">{slide.subtitle}</p>
										<a
											href={slide.button.link}
											className="inline-block px-4 py-2 mt-2 bg-[#FFD700] text-[#1A1A1A] rounded hover:bg-white transition"
										>
											{slide.button.text}
										</a>
									</div>
								</div>
							))
						)}

						{/* Arrows */}
						<button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1B3C34] rounded-full w-9 h-9 flex items-center justify-center z-20">&#8249;</button>
						<button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1B3C34] rounded-full w-9 h-9 flex items-center justify-center z-20">&#8250;</button>

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
