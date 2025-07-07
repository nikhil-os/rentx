/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'rentx-backend.onrender.com',
      'images.unsplash.com',
      'img.freepik.com',
      'm.media-amazon.com',
      'cdn.pixabay.com',
      'media.istockphoto.com',
      'static.toiimg.com',
      'via.placeholder.com',
      'rentx-tau.vercel.app',
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;
