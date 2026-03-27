'use client';

import { useState } from 'react';

import SoundUploader from '@/components/sound/SoundUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/i18n/useTranslation';
import { useCreateComment } from '@/lib/api/queries/useComments';
import type { CommentType } from '@/types/switch';

const CommentForm = ({ switchId }: { switchId: string }) => {
  const { t } = useTranslation();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<CommentType>('한줄평');
  const [soundUrl, setSoundUrl] = useState<string | undefined>();

  const mutation = useCreateComment(switchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    mutation.mutate(
      {
        content: content.trim(),
        author: author.trim() || t('common.anonymous'),
        type,
        soundUrl,
      },
      {
        onSuccess: () => {
          setContent('');
          setSoundUrl(undefined);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-border rounded-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author" className="mb-2 block">
            {t('comment.nickname')}
          </Label>
          <Input
            id="author"
            placeholder={t('common.anonymous')}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 block">{t('switch.type')}</Label>
          <Select value={type} onValueChange={(v) => setType(v as CommentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="한줄평">{t('comment.oneLiner')}</SelectItem>
              <SelectItem value="빌드공유">
                {t('comment.buildShare')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content" className="mb-2 block">
          {t('comment.content')}
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
        />
      </div>

      {type === '빌드공유' && (
        <div className="flex items-center gap-4">
          <SoundUploader onUploadComplete={setSoundUrl} />
          {soundUrl && (
            <span className="text-xs text-muted-foreground">Uploaded</span>
          )}
        </div>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? t('comment.writing') : t('comment.write')}
      </Button>
    </form>
  );
};

export default CommentForm;
