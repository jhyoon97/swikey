'use client';

import { useRef, useState } from 'react';

import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import api from '@/lib/api/axios';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

interface SoundUploaderProps {
  onUploadComplete: (url: string) => void;
}

const SoundUploader = ({ onUploadComplete }: SoundUploaderProps) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t('sound.invalidFormat'));
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error(t('sound.fileTooLarge'));
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const { data } = await api.post('/upload', {
        fileName: file.name,
        fileType: file.type,
      });

      await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setProgress(100);
      onUploadComplete(data.fileUrl);
      toast.success(t('sound.upload'));
    } catch {
      toast.error(t('submit.error'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/ogg"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? `${t('sound.uploading')} ${progress}%` : t('sound.upload')}
      </Button>
    </div>
  );
};

export default SoundUploader;
