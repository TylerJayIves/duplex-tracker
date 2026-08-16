import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Next's own default is 1MB, well under our 10MB attachment limit --
      // that default silently rejects the request before uploadAttachmentAction
      // ever runs, so the app-level size check never even gets a chance to fire.
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
