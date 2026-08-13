import { z } from "zod";

export const articleInputSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(280),
  category: z.string().trim().min(2).max(40),
  tags: z.array(z.string().trim().min(1).max(30)).max(8),
  coverUrl: z.string().trim().url().or(z.literal("")),
  body: z.string().trim().min(80).max(150000),
});

export const engagementSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

export function parseArticleForm(formData) {
  return articleInputSchema.parse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    tags: String(formData.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    coverUrl: formData.get("coverUrl") || "",
    body: formData.get("body"),
  });
}

export function readingMinutes(markdown) {
  const visible = markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`\[\]()!-]/g, " ").trim();
  return Math.max(1, Math.ceil(visible.length / 500));
}
