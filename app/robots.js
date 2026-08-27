import { siteConfig } from "./_data/site";
export default function robots() { return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: `${siteConfig.siteUrl}/sitemap.xml` }; }
