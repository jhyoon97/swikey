import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import CommentSection from '@/components/comment/CommentSection';
import SwitchDetail from '@/components/switch/SwitchDetail';
import { getSwitchBySlug, getSwitches } from '@/lib/notion/switches';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const sw = await getSwitchBySlug(slug);
  if (!sw) return { title: 'Switch Not Found' };

  return {
    title: `${sw.name} - SwiKeys`,
    description: `${sw.name} (${sw.type}) - ${sw.manufacturer ?? ''} | 키보드 스위치 상세 정보`,
    openGraph: {
      title: `${sw.name} - SwiKeys`,
      description: `${sw.name} 키보드 스위치 상세 정보`,
      images: undefined,
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const switches = await getSwitches(20);
    return switches.map((sw) => ({ slug: sw.slug }));
  } catch {
    return [];
  }
};

const SwitchDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const sw = await getSwitchBySlug(slug);

  if (!sw) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <SwitchDetail sw={sw} />
      <div className="mt-12">
        <CommentSection switchId={sw.id} />
      </div>
    </div>
  );
};

export default SwitchDetailPage;
