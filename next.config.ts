import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/conference", destination: "/conferences", permanent: false },
      { source: "/grant", destination: "/grants", permanent: false },
      { source: "/award", destination: "/awards", permanent: false },
      { source: "/journal", destination: "/journals", permanent: false },
    ];
  },
};

export default nextConfig;
