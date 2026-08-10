/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.zirelly.az",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/products", destination: "/mehsullar", permanent: true },
      { source: "/products/:slug", destination: "/mehsullar/:slug", permanent: true },
      { source: "/blogs", destination: "/bloqlar", permanent: true },
      { source: "/blogs/:slug", destination: "/bloqlar/:slug", permanent: true },
      { source: "/about", destination: "/haqqimizda", permanent: true },
      { source: "/contact", destination: "/elaqe", permanent: true },
      { source: "/cart", destination: "/sebet", permanent: true },
      { source: "/profile", destination: "/profil", permanent: true },
      { source: "/return-policy", destination: "/geri-qaytarma", permanent: true },
      { source: "/privacy-policy", destination: "/mexfilik-siyaseti", permanent: true },
      { source: "/payment/result", destination: "/odenis-neticesi", permanent: true },
    ];
  },
};

export default nextConfig;
