import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

const DESCRIPTION = 'A clear description of the article that is long enough to satisfy the SEO length rule.';

function frontmatter(overrides: Record<string, string> = {}): string {
  const fields: Record<string, string> = {
    title: 'A good article title',
    description: DESCRIPTION,
    date: '2026-11-20',
    sources: '\n  - label: CDC\n    url: https://www.cdc.gov/',
    ...overrides,
  };
  const body = Object.entries(fields)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return `---\n${body}\n---\n\nHello world.\n`;
}

describe('blog loader', () => {
  let dir: string;

  const write = (name: string, contents: string) => fs.writeFileSync(path.join(dir, name), contents);

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-test-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('returns an empty list when the folder does not exist', () => {
    expect(getAllPosts(path.join(dir, 'missing'))).toEqual([]);
  });

  it('parses frontmatter, including an unquoted YAML date', () => {
    write('first-post.md', frontmatter());
    const [post] = getAllPosts(dir);
    expect(post).toMatchObject({ slug: 'first-post', date: '2026-11-20', draft: false });
    expect(post.sources).toHaveLength(1);
    expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it('excludes drafts and sorts newest first', () => {
    write('older.md', frontmatter({ date: '2026-10-01' }));
    write('newer.md', frontmatter({ date: '2026-11-20' }));
    write('hidden.md', frontmatter({ draft: 'true' }));
    expect(getAllPosts(dir).map((p) => p.slug)).toEqual(['newer', 'older']);
    expect(getPostBySlug('hidden', dir)).toBeNull();
  });

  it('ignores files that are not valid slugs, such as README.md', () => {
    write('README.md', '# How to write articles');
    write('Bad_Name.md', frontmatter());
    expect(getAllPosts(dir)).toEqual([]);
  });

  it('fails the build when an article has no sources', () => {
    write('no-sources.md', frontmatter({ sources: '' }));
    expect(() => getAllPosts(dir)).toThrow(/no-sources/);
  });

  it('rejects slugs that try to escape the folder', () => {
    expect(getPostBySlug('../secret', dir)).toBeNull();
    expect(getPostBySlug('a/b', dir)).toBeNull();
  });
});
