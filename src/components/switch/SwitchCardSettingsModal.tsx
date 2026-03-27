'use client';

import { useCallback, useRef, useState } from 'react';

import { GripVertical, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PROPERTY_LABEL_KEYS,
  type SwitchCardProperty,
  getSettings,
  saveSettings,
} from '@/hooks/useSwitchCardSettings';
import { useTranslation } from '@/i18n/useTranslation';

const SCROLL_ZONE = 40;
const SCROLL_SPEED = 8;

const SwitchCardSettingsModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<SwitchCardProperty[]>([]);
  const dragItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setProperties(getSettings());
    }
    setOpen(isOpen);
  };

  const handleToggle = (index: number) => {
    setProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleContainerDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const container = scrollRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const y = e.clientY - rect.top;

      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);

      if (y < SCROLL_ZONE) {
        const step = () => {
          container.scrollTop -= SCROLL_SPEED;
          if (container.scrollTop > 0) {
            scrollRaf.current = requestAnimationFrame(step);
          }
        };
        scrollRaf.current = requestAnimationFrame(step);
      } else if (y > rect.height - SCROLL_ZONE) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        const step = () => {
          container.scrollTop += SCROLL_SPEED;
          if (container.scrollTop < maxScroll) {
            scrollRaf.current = requestAnimationFrame(step);
          }
        };
        scrollRaf.current = requestAnimationFrame(step);
      }
    },
    [],
  );

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverIndex;
    dragItem.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current);
      scrollRaf.current = null;
    }

    if (from === null || to === null || from === to) return;

    setProperties((prev) => {
      const items = [...prev];
      const dragged = items[from];
      items.splice(from, 1);
      items.splice(to, 0, dragged);
      return items;
    });
  };

  const handleSave = () => {
    saveSettings(properties);
    setOpen(false);
  };

  const getIndicator = (index: number) => {
    if (
      dragIndex === null ||
      dragOverIndex === null ||
      dragIndex === dragOverIndex
    )
      return null;
    if (dragIndex < dragOverIndex && index === dragOverIndex) return 'bottom';
    if (dragIndex > dragOverIndex && index === dragOverIndex) return 'top';
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <SlidersHorizontal className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.cardDisplay')}</DialogTitle>
          <DialogDescription>
            {t('settings.cardDisplayDescription')}
          </DialogDescription>
        </DialogHeader>
        <div
          ref={scrollRef}
          className="max-h-80 overflow-y-auto -mx-1"
          onDragOver={handleContainerDragOver}
        >
          {properties.map((prop, index) => {
            const indicator = getIndicator(index);
            return (
              <div
                key={prop.key}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 bg-background cursor-grab active:cursor-grabbing border-2 border-transparent transition-colors ${
                  dragIndex === index
                    ? 'opacity-40'
                    : dragIndex !== null && dragOverIndex === index
                      ? 'bg-muted/50'
                      : 'hover:bg-muted'
                } ${indicator === 'top' ? 'border-t-primary' : ''} ${indicator === 'bottom' ? 'border-b-primary' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <Checkbox
                  checked={prop.enabled}
                  onCheckedChange={() => handleToggle(index)}
                />
                <span className="text-sm select-none">
                  {t(PROPERTY_LABEL_KEYS[prop.key])}
                </span>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwitchCardSettingsModal;
