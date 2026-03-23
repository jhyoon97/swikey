'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import api from '@/lib/api/axios';
import type { SubmitSwitchData, SwitchType, MountPins } from '@/types/switch';

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

  const updateField = <K extends keyof SubmitSwitchData>(key: K, value: SubmitSwitchData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="nameKo" className="mb-2 block">
              {t('submit.switchNameKo')}
            </Label>
            <Input
              id="nameKo"
              value={form.nameKo ?? ''}
              onChange={(e) => updateField('nameKo', e.target.value || undefined)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer" className="mb-2 block">
                {t('switch.manufacturer')}
              </Label>
              <Input
                id="manufacturer"
                value={form.manufacturer ?? ''}
                onChange={(e) => updateField('manufacturer', e.target.value || undefined)}
              />
            </div>

            <div>
              <Label className="mb-2 block">{t('switch.type')}</Label>
              <Select
                value={form.type ?? ''}
                onValueChange={(v) => updateField('type', (v || undefined) as SwitchType | undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('switch.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="리니어">{t('switch.linear')}</SelectItem>
                  <SelectItem value="택타일">{t('switch.tactile')}</SelectItem>
                  <SelectItem value="hall effect">{t('switch.hallEffect')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="upperHousing" className="mb-2 block">
                {t('switch.upperHousing')}
              </Label>
              <Input
                id="upperHousing"
                value={form.upperHousingMaterial ?? ''}
                onChange={(e) => updateField('upperHousingMaterial', e.target.value || undefined)}
              />
            </div>

            <div>
              <Label htmlFor="lowerHousing" className="mb-2 block">
                {t('switch.lowerHousing')}
              </Label>
              <Input
                id="lowerHousing"
                value={form.lowerHousingMaterial ?? ''}
                onChange={(e) => updateField('lowerHousingMaterial', e.target.value || undefined)}
              />
            </div>

            <div>
              <Label htmlFor="stemMaterial" className="mb-2 block">
                {t('switch.stemMaterial')}
              </Label>
              <Input
                id="stemMaterial"
                value={form.stemMaterial ?? ''}
                onChange={(e) => updateField('stemMaterial', e.target.value || undefined)}
              />
            </div>

            <div>
              <Label className="mb-2 block">{t('switch.mountPins')}</Label>
              <Select
                value={form.mountPins !== undefined ? String(form.mountPins) : ''}
                onValueChange={(v) =>
                  updateField('mountPins', v ? (Number(v) as MountPins) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('switch.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">{t('switch.pin5')}</SelectItem>
                  <SelectItem value="3">{t('switch.pin3')}</SelectItem>
                  <SelectItem value="0">{t('switch.pinNone')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="springLength" className="mb-2 block">
                {t('switch.springLength')} ({t('switch.mm')})
              </Label>
              <Input
                id="springLength"
                type="number"
                step="0.1"
                value={form.springLength ?? ''}
                onChange={(e) =>
                  updateField('springLength', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div>
              <Label htmlFor="travel" className="mb-2 block">
                {t('switch.travel')} ({t('switch.mm')})
              </Label>
              <Input
                id="travel"
                type="number"
                step="0.1"
                value={form.travel ?? ''}
                onChange={(e) =>
                  updateField('travel', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div>
              <Label htmlFor="actuationPoint" className="mb-2 block">
                {t('switch.actuationPoint')} ({t('switch.mm')})
              </Label>
              <Input
                id="actuationPoint"
                type="number"
                step="0.1"
                value={form.actuationPoint ?? ''}
                onChange={(e) =>
                  updateField('actuationPoint', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div>
              <Label htmlFor="actuationForce" className="mb-2 block">
                {t('switch.actuationForce')} ({t('switch.g')})
              </Label>
              <Input
                id="actuationForce"
                type="number"
                value={form.actuationForce ?? ''}
                onChange={(e) =>
                  updateField(
                    'actuationForce',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="initialForce" className="mb-2 block">
                {t('switch.initialForce')} ({t('switch.g')})
              </Label>
              <Input
                id="initialForce"
                type="number"
                value={form.initialForce ?? ''}
                onChange={(e) =>
                  updateField('initialForce', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div>
              <Label htmlFor="bottomForce" className="mb-2 block">
                {t('switch.bottomForce')} ({t('switch.g')})
              </Label>
              <Input
                id="bottomForce"
                type="number"
                value={form.bottomForce ?? ''}
                onChange={(e) =>
                  updateField('bottomForce', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="factoryLubed"
              checked={form.factoryLubed ?? false}
              onCheckedChange={(checked) => updateField('factoryLubed', checked === true)}
            />
            <Label htmlFor="factoryLubed">{t('switch.factoryLubed')}</Label>
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t('submit.submitting') : t('submit.submitButton')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default SwitchSubmitForm;
