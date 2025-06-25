import Image from "next/image";
import { useState, useEffect } from "react";
import { api, getImageUrl } from "@/utils/api";

const categorySlugs = [
	"vehicles",
	"kids",
	"furniture",
	"fashion",
	"decor",
	"electronics",
	"accessories",
	"sports",
	"female",
	"male",
];

export default function HeroSection() {
	const [slides, setSlides] = useState([]);
	const [current, setCurrent] = useState(0);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchSlides() {
			try {
				setLoading(true);
				setError(null);
				console.log('Fetching products from API...');
				const data = await api.get("/rentals");
				console.log('Products received:', data);
				
				const allProducts = [];
				for (const category of categorySlugs) {
					const filtered = data.filter(
						(item) =>
							(item.category || item.Category || "").toLowerCase().trim() === category
					);
					allProducts.push(...filtered);
				}
				
				const mapped = allProducts.map((item) => ({
					image: getImageUrl(item.image || item.img || "/ref1.png"),
					title: item.name || item.title || "Product",
					subtitle: item.price ? `₹${item.price}/day` : item.category || "",
					button: { text: "Rent Now", link: `/booking?rentalId=${item._id}` },
				}));
				setSlides(
					mapped.length
						? mapped
						: [getFallbackSlide("No products found", "Please check back later.")]
				);
			} catch (err) {
				console.error("Error fetching slides:", err);
				setError(err.message || "Failed to load products");
				setSlides([
					getFallbackSlide(
						"Error loading products",
						"Please try again later"
					),
				]);
			} finally {
				setLoading(false);
			}
		}

		fetchSlides();
	}, []);

	function getFallbackSlide(title, subtitle) {
		return {
			image: "/heroref.png",
			title,
			subtitle,
			button: { text: "Browse Categories", link: "/category" },
		};
	}

	const nextSlide = () => {
		setCurrent((current + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrent((current - 1 + slides.length) % slides.length);
	};

	useEffect(() => {
		if (slides.length <= 1) return;
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	}, [current, slides.length]);

	if (loading) {
		return (
			<section className="relative h-[600px] bg-gray-100 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="relative h-[600px] bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Something went wrong
					</h2>
					<p className="text-gray-600">{error}</p>
				</div>
			</section>
		);
	}

	return (
		<section className="relative h-[600px] overflow-hidden">
			{slides.map((slide, index) => (
				<div
					key={index}
					className={`absolute inset-0 transition-opacity duration-1000 ${
						index === current ? "opacity-100" : "opacity-0 pointer-events-none"
					}`}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent z-10"></div>
					<div className="relative h-full">
						<Image
							src={slide.image}
							alt={slide.title}
							fill
							priority={index === current}
							className="object-cover"
						/>
					</div>
					<div className="absolute inset-0 z-20 flex items-center">
						<div className="container mx-auto px-4">
							<div className="max-w-lg">
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
									{slide.title}
								</h1>
								<p className="text-xl text-white mb-6 drop-shadow-md">
									{slide.subtitle}
								</p>
								<a
									href={slide.button.link}
									className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
								>
									{slide.button.text}
								</a>
							</div>
						</div>
					</div>
				</div>
			))}

			{slides.length > 1 && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
						aria-label="Previous slide"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
						aria-label="Next slide"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
					</button>

					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
						{slides.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrent(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === current ? "bg-white" : "bg-white/50"
								}`}
								aria-label={`Go to slide ${index + 1}`}
							></button>
						))}
					</div>
				</>
			)}
		</section>
	);
}
