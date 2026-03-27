'use client';

import { Keyboard } from 'lucide-react';

import { useTranslation } from '@/i18n/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Keyboard className="h-5 w-5" />
            <span className="font-semibold">{t('footer.copyright')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('footer.description')}
          </p>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} SwiKeys. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
