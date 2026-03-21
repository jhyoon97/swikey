import { NextResponse } from 'next/server';
import { getManufacturers } from '@/lib/notion/switches';

export const revalidate = 60;

export const GET = async () => {
  try {
    const manufacturers = await getManufacturers();
    return NextResponse.json(manufacturers);
  } catch (error) {
    console.error('Failed to fetch manufacturers:', error);
    return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
  }
};
