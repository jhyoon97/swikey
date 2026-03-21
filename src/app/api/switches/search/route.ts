import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { searchSwitches } from '@/lib/notion/switches';
import type { SwitchType, MountPins } from '@/types/switch';

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
      travelMin: searchParams.get('travelMin')
        ? Number(searchParams.get('travelMin'))
        : undefined,
      travelMax: searchParams.get('travelMax')
        ? Number(searchParams.get('travelMax'))
        : undefined,
    };

    const switches = await searchSwitches(filters);
    return NextResponse.json(switches);
  } catch (error) {
    console.error('Failed to search switches:', error);
    return NextResponse.json({ error: 'Failed to search switches' }, { status: 500 });
  }
};
