/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static optimization for pages that require server-side features
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip pre-rendering for API routes during build
  output: "standalone",
};

export default nextConfig;
