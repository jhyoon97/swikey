'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CommentType, SwitchComment } from '@/types/switch';

import api from '../axios';

export const useComments = (switchId: string) => {
  return useQuery<SwitchComment[]>({
    queryKey: ['comments', switchId],
    queryFn: async () => {
      const { data } = await api.get(`/comments?switchId=${switchId}`);
      return data;
    },
    enabled: !!switchId,
  });
};

export const useCreateComment = (switchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      content: string;
      author: string;
      type: CommentType;
      soundUrl?: string;
    }) => {
      const { data } = await api.post('/comments', { switchId, ...payload });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', switchId] });
    },
  });
};
