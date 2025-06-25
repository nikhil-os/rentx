/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'images.unsplash.com',
      'img.freepik.com',
      'm.media-amazon.com',
      'cdn.pixabay.com',
      'media.istockphoto.com',
      'static.toiimg.com',
      'via.placeholder.com',
    ],
  },
  // Disable ESLint during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
