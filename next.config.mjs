import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  agentRules: false,
  pageExtensions: ["js", "jsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
