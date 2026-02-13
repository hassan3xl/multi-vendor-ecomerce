import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: If you want to restrict to certain paths (usually not needed for Cloudinary)
        // pathname: '/dfu8qswfh/**',
      },
    ],
  },
};

export default nextConfig;
