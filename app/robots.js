import { siteConfig } from "./_data/site";
export default function robots() { return { rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/account/", "/login/", "/api/"] }, sitemap: `${siteConfig.siteUrl}/sitemap.xml` }; }
