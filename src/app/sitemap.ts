import type { MetadataRoute } from 'next';

import { getSwitches } from '@/lib/notion/switches';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://swikeys.com';

  let switches: Awaited<ReturnType<typeof getSwitches>> = [];
  try {
    switches = await getSwitches(100);
  } catch {
    // Notion API unavailable
  }

  const switchUrls = switches.map((sw) => ({
    url: `${baseUrl}/switches/${sw.id}`,
    lastModified: new Date(sw.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/switches`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...switchUrls,
  ];
};

export default sitemap;
