'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n/useTranslation';
import api from '@/lib/api/axios';
import type { SubmitSwitchData } from '@/types/switch';

const SwitchSubmitForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<SubmitSwitchData>({ name: '' });

  const mutation = useMutation({
    mutationFn: async (data: SubmitSwitchData) => {
      const res = await api.post('/submit', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t('submit.success'));
      setForm({ name: '' });
    },
    onError: () => {
      toast.error(t('submit.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error(t('submit.switchNameRequired'));
      return;
    }
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              {t('submit.switchName')} *
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="source" className="mb-2 block">
              {t('submit.source')}
            </Label>
            <Input
              id="source"
              value={form.source ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  source: e.target.value || undefined,
                }))
              }
              placeholder={t('submit.sourcePlaceholder')}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? t('submit.submitting')
              : t('submit.submitButton')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default SwitchSubmitForm;
