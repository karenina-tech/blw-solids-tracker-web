import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// YAML turns an unquoted 2026-11-20 into a Date, so accept both and normalise to YYYY-MM-DD.
const DateField = z.union([
  z.date().transform((d) => d.toISOString().slice(0, 10)),
  z.string().regex(DATE_PATTERN, 'Use the format YYYY-MM-DD'),
]);

const FrontmatterSchema = z
  .object({
    title: z.string().min(10).max(90),
    description: z.string().min(70).max(165),
    date: DateField,
    updated: DateField.optional(),
    draft: z.boolean().default(false),
    // "guide" = health information (must cite sources). "story" = personal experience.
    type: z.enum(['guide', 'story']).default('guide'),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({ label: z.string().min(1), url: z.url() })).default([]),
  })
  .refine((post) => post.type === 'story' || post.sources.length > 0, {
    message: 'Guides must cite at least one source (use type: story for personal posts)',
    path: ['sources'],
  });

export type PostMeta = z.infer<typeof FrontmatterSchema> & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function parseFile(filePath: string, slug: string): Post {
  const raw = fs.readFileSync(/* turbopackIgnore: true */ filePath, 'utf8');
  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `${i.path.join('.') || 'frontmatter'}: ${i.message}`);
    throw new Error(`Invalid frontmatter in content/blog/${slug}.md -> ${problems.join('; ')}`);
  }
  return { ...parsed.data, slug, content, readingMinutes: readingMinutes(content) };
}

/** Published posts only (drafts excluded), newest first. */
export function getAllPosts(dir: string = BLOG_DIR): Post[] {
  if (!fs.existsSync(/* turbopackIgnore: true */ dir)) return [];
  return fs
    .readdirSync(/* turbopackIgnore: true */ dir)
    .filter((file) => file.endsWith('.md') && SLUG_PATTERN.test(file.slice(0, -3)))
    .map((file) => parseFile(path.join(/* turbopackIgnore: true */ dir, file), file.slice(0, -3)))
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string, dir: string = BLOG_DIR): Post | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const filePath = path.join(/* turbopackIgnore: true */ dir, `${slug}.md`);
  if (!fs.existsSync(/* turbopackIgnore: true */ filePath)) return null;
  const post = parseFile(filePath, slug);
  return post.draft ? null : post;
}
