import { NextResponse } from 'next/server';

import { getSwitches } from '@/lib/notion/switches';

export const revalidate = 60;

export const GET = async () => {
  try {
    const switches = await getSwitches();
    return NextResponse.json(switches);
  } catch (error) {
    console.error('Failed to fetch switches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch switches' },
      { status: 500 },
    );
  }
};
