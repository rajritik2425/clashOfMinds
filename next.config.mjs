/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://clash-of-minds.onrender.com/:path*',
      },
    ]
  },
};

export default nextConfig;
