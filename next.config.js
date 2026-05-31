/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teddybearhaven.co.ke",
        pathname: "/wp-content/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
