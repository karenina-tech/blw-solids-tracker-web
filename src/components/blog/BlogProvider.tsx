'use client';

import { createContext, useContext } from 'react';

export type BlogLink = { slug: string; title: string };

const BlogContext = createContext<BlogLink[]>([]);

/** Gives client components the published article list, which is read from disk on the server. */
export function BlogProvider({ posts, children }: { posts: BlogLink[]; children: React.ReactNode }) {
  return <BlogContext.Provider value={posts}>{children}</BlogContext.Provider>;
}

export function useBlogPosts(): BlogLink[] {
  return useContext(BlogContext);
}
