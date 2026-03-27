import SwitchSubmitForm from '@/components/switch/SwitchSubmitForm';
import { getTranslation } from '@/i18n/getTranslation';

const SubmitPage = async () => {
  const { t } = await getTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{t('submit.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('submit.description')}</p>
      <SwitchSubmitForm />
    </div>
  );
};

export default SubmitPage;
