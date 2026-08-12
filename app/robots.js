import { siteConfig } from "./_data/site";
export const dynamic = "force-static";
export default function robots() { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteConfig.siteUrl}/sitemap.xml` }; }
