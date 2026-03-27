'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n/useTranslation';
import { useComments } from '@/lib/api/queries/useComments';

import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentSection = ({ switchId }: { switchId: string }) => {
  const { t } = useTranslation();
  const { data: comments, isLoading } = useComments(switchId);

  const oneLiners = comments?.filter((c) => c.type === '한줄평') ?? [];
  const buildShares = comments?.filter((c) => c.type === '빌드공유') ?? [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('comment.title')}</h2>

      <CommentForm switchId={switchId} />

      <Tabs defaultValue="oneLiner" className="mt-6">
        <TabsList>
          <TabsTrigger value="oneLiner">
            {t('comment.oneLiner')} ({oneLiners.length})
          </TabsTrigger>
          <TabsTrigger value="buildShare">
            {t('comment.buildShare')} ({buildShares.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="oneLiner">
          {isLoading ? (
            <p className="text-muted-foreground py-4">{t('common.loading')}</p>
          ) : (
            <CommentList comments={oneLiners} />
          )}
        </TabsContent>
        <TabsContent value="buildShare">
          {isLoading ? (
            <p className="text-muted-foreground py-4">{t('common.loading')}</p>
          ) : (
            <CommentList comments={buildShares} showSound />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommentSection;
