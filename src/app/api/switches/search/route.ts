import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { searchSwitches } from '@/lib/notion/switches';
import type { MountPins, SwitchType } from '@/types/switch';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;

    const filters = {
      query: searchParams.get('q') || undefined,
      type: (searchParams.get('type') as SwitchType) || undefined,
      manufacturer: searchParams.get('manufacturer') || undefined,
      mountPins: searchParams.get('mountPins')
        ? (Number(searchParams.get('mountPins')) as MountPins)
        : undefined,
      silent:
        searchParams.get('silent') !== null
          ? searchParams.get('silent') === 'true'
          : undefined,
      factoryLubed:
        searchParams.get('factoryLubed') !== null
          ? searchParams.get('factoryLubed') === 'true'
          : undefined,
      actuationMin: searchParams.get('actuationMin')
        ? Number(searchParams.get('actuationMin'))
        : undefined,
      actuationMax: searchParams.get('actuationMax')
        ? Number(searchParams.get('actuationMax'))
        : undefined,
      initialMin: searchParams.get('initialMin')
        ? Number(searchParams.get('initialMin'))
        : undefined,
      initialMax: searchParams.get('initialMax')
        ? Number(searchParams.get('initialMax'))
        : undefined,
      bottomMin: searchParams.get('bottomMin')
        ? Number(searchParams.get('bottomMin'))
        : undefined,
      bottomMax: searchParams.get('bottomMax')
        ? Number(searchParams.get('bottomMax'))
        : undefined,
      travelMin: searchParams.get('travelMin')
        ? Number(searchParams.get('travelMin'))
        : undefined,
      travelMax: searchParams.get('travelMax')
        ? Number(searchParams.get('travelMax'))
        : undefined,
    };

    const cursor = searchParams.get('cursor') || undefined;
    const result = await searchSwitches(filters, cursor);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to search switches:', error);
    return NextResponse.json(
      { error: 'Failed to search switches' },
      { status: 500 },
    );
  }
};
