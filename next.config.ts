import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // @ts-expect-error - buildActivity is valid/needed to hide indicators
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;
