import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind CSS v4 is compiled through the Turbopack loader (there is no PostCSS config).
  // Removing this rule leaves every Tailwind class unstyled.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Couples can paste photo URLs from any HTTPS host in the builder.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
