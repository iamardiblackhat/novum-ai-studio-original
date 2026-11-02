/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/dashboard.html',
        },
        {
          source: '/studio',
          destination: '/dashboard.html',
        },
      ],
    };
  },
};

export default nextConfig;
