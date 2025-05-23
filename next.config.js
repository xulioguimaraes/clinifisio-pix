/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["page.tsx", "api.ts", "api.tsx"],
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xlblurduqkgztcayqtni.supabase.co",
        pathname: "/storage/v1/object/public/avatars/services/**",
      },
    ],
  },
  transpilePackages: [
    "@mui/x-date-pickers",
    "@mui/material",
    "@mui/icons-material",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mui/material/styles": "@mui/material/styles/index.js",
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_ASAAS_API_KEY: process.env.NEXT_PUBLIC_ASAAS_API_KEY,
    NEXT_PUBLIC_ASAAS_API_URL: process.env.NEXT_PUBLIC_ASAAS_API_URL,
  },
};

module.exports = nextConfig;
