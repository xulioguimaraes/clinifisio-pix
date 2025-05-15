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
};

module.exports = nextConfig;
