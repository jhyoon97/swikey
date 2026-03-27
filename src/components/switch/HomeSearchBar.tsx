'use client';

import { useState } from 'react';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';

const HomeSearchBar = ({ placeholder }: { placeholder: string }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/switches?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-12 pr-4 h-12 text-base rounded-full"
      />
    </form>
  );
};

export default HomeSearchBar;
