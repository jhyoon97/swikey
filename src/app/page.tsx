import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import HomeSearchBar from '@/components/switch/HomeSearchBar';
import SwitchCardGrid from '@/components/switch/SwitchCardGrid';
import SwitchCardSettingsModal from '@/components/switch/SwitchCardSettingsModal';
import { getTranslation } from '@/i18n/getTranslation';
import { getSwitches } from '@/lib/notion/switches';

export const revalidate = 300;

const HomePage = async () => {
  const { t } = await getTranslation();
  let switches: Awaited<ReturnType<typeof getSwitches>> = [];
  try {
    switches = await getSwitches(8);
  } catch {
    // Notion API unavailable
  }

  return (
    <div>
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <HomeSearchBar placeholder={t('hero.searchPlaceholder')} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{t('switch.recentSwitches')}</h2>
          <div className="flex items-center gap-2">
            <SwitchCardSettingsModal />
            <Link
              href="/switches"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {t('common.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <SwitchCardGrid switches={switches} />
      </section>
    </div>
  );
};

export default HomePage;
