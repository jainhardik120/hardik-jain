import { getPageCount, getPostSlugs } from '@/actions/blog';
import { getBaseUrl } from '@/lib/getBaseUrl';

import type { MetadataRoute } from 'next';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const postSlugs = (await getPostSlugs()).map((slug) => `/post/${slug.slug}`);
  const blogPages = Array.from({ length: await getPageCount() }, (_, i) => i + 1).map(
    (page) => `/blog/${page}`,
  );

  const paths = ['/', ...blogPages, ...postSlugs];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
