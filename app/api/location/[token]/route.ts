import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await prisma.locationShare.findUnique({
    where: { token },
    select: { latitude: true, longitude: true, accuracy: true, updatedAt: true, expiresAt: true, revokedAt: true, user: { select: { name: true } } },
  });
  if (!share || share.revokedAt || (share.expiresAt && share.expiresAt <= new Date())) {
    return NextResponse.json({ error: "Este link de localização foi encerrado ou expirou." }, { status: 410 });
  }
  return NextResponse.json({ name: share.user.name, latitude: share.latitude, longitude: share.longitude, accuracy: share.accuracy, updatedAt: share.updatedAt, expiresAt: share.expiresAt }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
