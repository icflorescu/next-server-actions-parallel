import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const n = req.nextUrl.searchParams.get('n');
  const duration = Number(req.nextUrl.searchParams.get('duration'));
  await new Promise((resolve) => setTimeout(resolve, duration));
  return Response.json({ n });
}
