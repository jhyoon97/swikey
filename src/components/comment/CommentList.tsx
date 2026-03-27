'use client';

import dayjs from 'dayjs';

import SoundPlayer from '@/components/sound/SoundPlayer';
import { useTranslation } from '@/i18n/useTranslation';
import type { SwitchComment } from '@/types/switch';

interface CommentListProps {
  comments: SwitchComment[];
  showSound?: boolean;
}

const CommentList = ({ comments, showSound }: CommentListProps) => {
  const { t } = useTranslation();

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        {t('comment.noComments')}
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {dayjs(comment.createdAt).format('YYYY.MM.DD HH:mm')}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          {showSound && comment.soundUrl && (
            <div className="mt-3">
              <SoundPlayer src={comment.soundUrl} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
