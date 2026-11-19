import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({ minutes: z.number().int().positive().max(10080).nullable() });
const updateSchema = z.object({ token: z.string().min(32).max(128), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), accuracy: z.number().nonnegative().optional() });

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Duração inválida." }, { status: 400 });
  const token = randomBytes(32).toString("base64url");
  const expiresAt = parsed.data.minutes ? new Date(Date.now() + parsed.data.minutes * 60_000) : null;
  const share = await prisma.locationShare.create({ data: { token, userId: user.id, expiresAt } });
  return NextResponse.json({ token: share.token, expiresAt: share.expiresAt, url: `/localizacao/${share.token}` }, { status: 201 });
}

export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  const { token, latitude, longitude, accuracy } = parsed.data;
  const result = await prisma.locationShare.updateMany({
    where: { token, userId: user.id, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    data: { latitude, longitude, accuracy: accuracy ?? null },
  });
  if (!result.count) return NextResponse.json({ error: "Link encerrado ou expirado." }, { status: 404 });
  return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { token } = await req.json().catch(() => ({}));
  if (typeof token !== "string") return NextResponse.json({ error: "Link inválido." }, { status: 400 });
  await prisma.locationShare.updateMany({ where: { token, userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
