const supabaseHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Avoid stale/missing chunk files on Windows during HMR (e.g. Cannot find module './8948.js')
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teddybearhaven.co.ke",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.tamboteddies.com.au",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.myshopify.com",
        pathname: "/**",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 828, 1200],
    imageSizes: [96, 256, 384],
    minimumCacheTTL: 86400,
  },
};

module.exports = nextConfig;
