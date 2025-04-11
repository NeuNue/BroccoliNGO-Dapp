import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    if (process.env.NEXT_PUBLIC_LOCAL === "true") {
      return [
        {
          source: "/api/:path*",
          destination: "https://dev.broccoli.ngo/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
