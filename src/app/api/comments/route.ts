import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createComment, getCommentsBySwitch } from '@/lib/notion/comments';
import type { CommentType } from '@/types/switch';

export const GET = async (request: NextRequest) => {
  try {
    const switchId = request.nextUrl.searchParams.get('switchId');
    if (!switchId) {
      return NextResponse.json(
        { error: 'switchId is required' },
        { status: 400 },
      );
    }

    const comments = await getCommentsBySwitch(switchId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { switchId, content, author, type, soundUrl } =
      (await request.json()) as {
        switchId: string;
        content: string;
        author: string;
        type: CommentType;
        soundUrl?: string;
      };

    if (!switchId || !content) {
      return NextResponse.json(
        { error: 'switchId and content are required' },
        { status: 400 },
      );
    }

    const commentId = await createComment(
      switchId,
      content,
      author,
      type,
      soundUrl,
    );
    return NextResponse.json({ id: commentId, success: true });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 },
    );
  }
};
