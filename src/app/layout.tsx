import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'SwiKeys - 키보드 스위치 위키',
  description:
    '키보드 스위치 정보를 위키 형태로 제공하며, 사용자가 제보/댓글/타건음을 공유할 수 있는 커뮤니티 사이트',
  openGraph: {
    title: 'SwiKeys - 키보드 스위치 위키',
    description:
      '모든 키보드 스위치 정보를 한 곳에서. 검색하고, 비교하고, 공유하세요.',
    type: 'website',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- 다크모드 FOUC 방지를 위해 동기 스크립트 필수 */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
