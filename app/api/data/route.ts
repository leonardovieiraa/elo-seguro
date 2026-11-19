import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const bodySchema = z.object({ data: z.record(z.string(), z.unknown()) });
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const record = await prisma.user.findUnique({ where: { id: user.id }, select: { data: true } });
  return NextResponse.json({ data: record?.data ?? {} });
}
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  await prisma.user.update({ where: { id: user.id }, data: { data: parsed.data.data as Prisma.InputJsonValue } });
  return NextResponse.json({ ok: true });
}
