import { NextRequest, NextResponse } from 'next/server';
import { getThumbnailRecords, deleteThumbnailRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const thumbnails = await getThumbnailRecords(platform, limit);

    return NextResponse.json({
      success: true,
      data: thumbnails,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch history';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await deleteThumbnailRecord(id);
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete record';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
