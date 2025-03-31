import { getPostSlugs } from '@/actions/blog';
import { getBaseUrl } from '@/lib/getBaseUrl';

import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const postSlugs = (await getPostSlugs()).map((slug) => `/post/${slug.slug}`);
  const paths = ['/', '/blog', '/blog/1', '/admin/post', '/post', ...postSlugs];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
