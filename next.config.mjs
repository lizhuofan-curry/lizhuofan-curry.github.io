import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  pageExtensions: ["js", "jsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
