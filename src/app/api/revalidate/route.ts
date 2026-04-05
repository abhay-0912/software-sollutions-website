import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  path?: string;
  tags?: unknown[];
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid token" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RevalidateBody;
  const path = typeof body.path === "string" ? body.path : "/";
  const tags = Array.isArray(body.tags) ? body.tags : [];

  revalidatePath(path);
  tags.forEach((tag: unknown) => {
    if (typeof tag === "string" && tag.trim()) {
      revalidateTag(tag);
    }
  });

  return NextResponse.json({ ok: true, revalidated: path, tags });
}
